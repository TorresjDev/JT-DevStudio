'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { signupSchema, loginSchema } from '@/lib/validations/auth-schemas'
import { authRateLimiter, checkRateLimit } from '@/lib/rate-limit'

export type AuthResult = {
  success: boolean
  error?: string
  redirectTo?: string
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
 * Login with email and password
 */
export async function login(formData: FormData): Promise<AuthResult> {
  // Rate limiting
  const clientIp = await getClientIp()
  const rateLimitResult = await checkRateLimit(authRateLimiter, `login:${clientIp}`)
  if (!rateLimitResult.success) {
    return { success: false, error: 'Too many login attempts. Please try again later.' }
  }

  // Server-side validation
  const validation = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validation.data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/' }
}

/**
 * Signup with full name, username, email, and password
 * Stores user metadata for profile creation trigger
 */
export async function signup(formData: FormData): Promise<AuthResult> {
  // Rate limiting
  const clientIp = await getClientIp()
  const rateLimitResult = await checkRateLimit(authRateLimiter, `signup:${clientIp}`)
  if (!rateLimitResult.success) {
    return { success: false, error: 'Too many signup attempts. Please try again later.' }
  }

  // Server-side validation
  const validation = signupSchema.safeParse({
    fullName: formData.get('fullName'),
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { fullName, username, email, password } = validation.data
  const supabase = await createClient()

  // Check username availability
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single()

  if (existingProfile) {
    return { success: false, error: 'Username is already taken' }
  }

  // Create user with metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_name: username.toLowerCase(),
      }
    }
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, redirectTo: '/' }
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  if (!username || username.length < 3) {
    return { available: false }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single()

  return { available: !data }
}

/**
 * Sign out the current user
 */
export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGithub() {
  const siteUrl = process.env.SITE_URL
  if (!siteUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.error('SITE_URL environment variable is not configured')
    }
    redirect('/error')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('GitHub sign in error:', error)
    }
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const siteUrl = process.env.SITE_URL
  if (!siteUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.error('SITE_URL environment variable is not configured')
    }
    redirect('/error')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Google sign in error:', error)
    }
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}
