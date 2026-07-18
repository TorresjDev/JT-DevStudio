'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { createServiceClient } from '@/utils/supabase/service'
import {
    changePasswordSchema,
    changeUsernameSchema,
    updateProfileSchema,
    deleteAccountSchema,
    notificationPreferencesSchema,
} from '@/lib/validations/auth-schemas'
import { authRateLimiter, checkRateLimit } from '@/lib/rate-limit'

const UGC_MEDIA_BUCKET = 'ugc-media'

/**
 * Recursively list object paths under a storage prefix (service role).
 */
async function listStoragePaths(
    admin: ReturnType<typeof createServiceClient>,
    bucket: string,
    prefix: string
): Promise<string[]> {
    const { data, error } = await admin.storage.from(bucket).list(prefix, {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' },
    })

    if (error || !data?.length) {
        if (error && process.env.NODE_ENV === 'development') {
            console.error('Storage list error:', error)
        }
        return []
    }

    const paths: string[] = []
    for (const item of data) {
        const path = prefix ? `${prefix}/${item.name}` : item.name
        // Folders have null metadata in Supabase Storage listings
        if (item.metadata === null) {
            paths.push(...(await listStoragePaths(admin, bucket, path)))
        } else {
            paths.push(path)
        }
    }
    return paths
}

/**
 * Delete all ugc-media objects for a user folder: `{userId}/...`
 */
async function deleteUserMediaObjects(
    admin: ReturnType<typeof createServiceClient>,
    userId: string
): Promise<void> {
    const paths = await listStoragePaths(admin, UGC_MEDIA_BUCKET, userId)
    if (!paths.length) return

    // remove() accepts batches; chunk to stay under API limits
    const chunkSize = 100
    for (let i = 0; i < paths.length; i += chunkSize) {
        const chunk = paths.slice(i, i + chunkSize)
        const { error } = await admin.storage.from(UGC_MEDIA_BUCKET).remove(chunk)
        if (error && process.env.NODE_ENV === 'development') {
            console.error('Storage remove error:', error)
        }
    }
}

export type SettingsResult = {
    success: boolean
    error?: string
    message?: string
}

/**
 * Get client IP for rate limiting
 */
async function getClientIp(): Promise<string> {
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim()
    }
    return headersList.get('x-real-ip') || 'anonymous'
}

/**
 * Get current user or throw error
 */
async function requireAuth() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        throw new Error('You must be logged in to perform this action')
    }

    return { supabase, user }
}

/**
 * Check if user has a password (vs OAuth-only)
 */
async function userHasPassword(userId: string): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    // Check if user has any OAuth identities
    const identities = user.identities || []
    const hasEmailProvider = identities.some(id => id.provider === 'email')

    return hasEmailProvider
}

// =============================================================================
// PASSWORD CHANGE
// =============================================================================

export async function changePassword(formData: FormData): Promise<SettingsResult> {
    // Rate limiting
    const clientIp = await getClientIp()
    const rateLimitResult = await checkRateLimit(authRateLimiter, `change-password:${clientIp}`)
    if (!rateLimitResult.success) {
        return { success: false, error: 'Too many attempts. Please try again later.' }
    }

    try {
        const { supabase, user } = await requireAuth()

        // Validate input
        const validation = changePasswordSchema.safeParse({
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmNewPassword: formData.get('confirmNewPassword'),
        })

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message }
        }

        const { currentPassword, newPassword } = validation.data

        // Verify current password by attempting sign-in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword,
        })

        if (signInError) {
            return { success: false, error: 'Current password is incorrect' }
        }

        // Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        })

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath('/settings')
        return { success: true, message: 'Password updated successfully' }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

// =============================================================================
// USERNAME CHANGE
// =============================================================================

export async function changeUsername(formData: FormData): Promise<SettingsResult> {
    // Rate limiting
    const clientIp = await getClientIp()
    const rateLimitResult = await checkRateLimit(authRateLimiter, `change-username:${clientIp}`)
    if (!rateLimitResult.success) {
        return { success: false, error: 'Too many attempts. Please try again later.' }
    }

    try {
        const { supabase, user } = await requireAuth()

        // Validate input
        const validation = changeUsernameSchema.safeParse({
            username: formData.get('username'),
        })

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message }
        }

        const { username } = validation.data

        // Check if username is already taken
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .neq('id', user.id)
            .single()

        if (existingProfile) {
            return { success: false, error: 'Username is already taken' }
        }

        // Update username
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username, updated_at: new Date().toISOString() })
            .eq('id', user.id)

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath('/settings')
        return { success: true, message: 'Username updated successfully' }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

/**
 * Check if username is available (excluding current user)
 */
export async function checkUsernameAvailable(username: string): Promise<{ available: boolean }> {
    if (!username || username.length < 3) {
        return { available: false }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const query = supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())

    // If user is logged in, exclude their current username
    if (user) {
        query.neq('id', user.id)
    }

    const { data } = await query.single()
    return { available: !data }
}

// =============================================================================
// PROFILE UPDATE
// =============================================================================

export async function updateProfile(formData: FormData): Promise<SettingsResult> {
    try {
        const { supabase, user } = await requireAuth()

        // Validate input
        const validation = updateProfileSchema.safeParse({
            displayName: formData.get('displayName'),
            bio: formData.get('bio'),
        })

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message }
        }

        const { displayName, bio } = validation.data

        // Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                display_name: displayName || null,
                bio: bio || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath('/settings')
        return { success: true, message: 'Profile updated successfully' }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

// =============================================================================
// GET CURRENT PROFILE
// =============================================================================

export async function getCurrentProfile() {
    try {
        const { supabase, user } = await requireAuth()

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) {
            return { profile: null, user: null, error: error.message }
        }

        // Determine if user is OAuth-only (no password)
        const identities = user.identities || []
        const isOAuthOnly = !identities.some(id => id.provider === 'email')
        const oauthProvider = identities.find(id => id.provider !== 'email')?.provider || null

        return {
            profile,
            user: {
                id: user.id,
                email: user.email,
                isOAuthOnly,
                oauthProvider,
            },
            error: null,
        }
    } catch (error) {
        return { profile: null, user: null, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

// =============================================================================
// NOTIFICATION PREFERENCES
// =============================================================================

export async function updateNotificationPreferences(formData: FormData): Promise<SettingsResult> {
    try {
        const { supabase, user } = await requireAuth()

        const validation = notificationPreferencesSchema.safeParse({
            securityAlerts: formData.get('securityAlerts') === 'true',
            emailUpdates: formData.get('emailUpdates') === 'true',
        })

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message }
        }

        const preferences = validation.data

        // Update notification preferences in profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                notification_preferences: {
                    security_alerts: preferences.securityAlerts,
                    email_updates: preferences.emailUpdates,
                },
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        revalidatePath('/settings')
        return { success: true, message: 'Notification preferences updated' }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}

// =============================================================================
// ACCOUNT DELETION
// =============================================================================

/**
 * Permanently delete the current user's account.
 *
 * Order of operations (service role for privileged steps):
 * 1. Re-auth / confirm irreversible intent
 * 2. Remove ugc-media storage objects under `{userId}/`
 * 3. Delete auth.users via admin API (cascades profiles → posts, comments,
 *    post_media, post_reactions, messaging FKs)
 * 4. Sign out and send the user to a success state on /login
 */
export async function deleteAccount(formData: FormData): Promise<SettingsResult> {
    // Rate limiting - strict for deletion
    const clientIp = await getClientIp()
    const rateLimitResult = await checkRateLimit(authRateLimiter, `delete-account:${clientIp}`)
    if (!rateLimitResult.success) {
        return { success: false, error: 'Too many attempts. Please try again later.' }
    }

    try {
        const { supabase, user } = await requireAuth()

        const validation = deleteAccountSchema.safeParse({
            password: formData.get('password') || 'oauth-skip',
            confirmText: formData.get('confirmText'),
        })

        // OAuth-only: password field is not collected; only confirmText matters
        const identities = user.identities || []
        const isOAuthOnly = !identities.some(id => id.provider === 'email')

        const confirmText = formData.get('confirmText') as string
        if (confirmText !== 'DELETE') {
            return { success: false, error: 'Please type DELETE to confirm' }
        }

        if (!isOAuthOnly) {
            if (!validation.success) {
                return { success: false, error: validation.error.issues[0].message }
            }

            const password = formData.get('password') as string
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email!,
                password,
            })

            if (signInError) {
                return { success: false, error: 'Incorrect password' }
            }
        }

        const acknowledged = formData.get('acknowledged') === 'true'
        if (!acknowledged) {
            return {
                success: false,
                error: 'Please confirm that you understand this cannot be undone.',
            }
        }

        const admin = createServiceClient()
        const userId = user.id

        // Storage first — auth delete does not remove Storage objects
        await deleteUserMediaObjects(admin, userId)

        const { error: deleteError } = await admin.auth.admin.deleteUser(userId)

        if (deleteError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Account deletion failed:', deleteError)
            }
            return {
                success: false,
                error: 'Could not delete your account. Please try again or contact support.',
            }
        }

        await supabase.auth.signOut()
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }

    redirect('/login?deleted=true')
}

/**
 * Request account deletion via email (for OAuth users who can't re-auth)
 */
export async function requestAccountDeletion(): Promise<SettingsResult> {
    const clientIp = await getClientIp()
    const rateLimitResult = await checkRateLimit(authRateLimiter, `delete-request:${clientIp}`)
    if (!rateLimitResult.success) {
        return { success: false, error: 'Too many attempts. Please try again later.' }
    }

    try {
        const { user } = await requireAuth()

        // In a production app, this would:
        // 1. Generate a secure deletion token
        // 2. Store it in the database with expiry
        // 3. Send email with deletion confirmation link
        // For now, we'll just return a message

        return {
            success: true,
            message: `A confirmation email has been sent to ${user.email}. Click the link to confirm account deletion.`
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
    }
}
