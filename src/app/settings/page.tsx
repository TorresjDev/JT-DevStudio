'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    User,
    AtSign,
    Lock,
    Bell,
    Trash2,
    AlertCircle,
    Check,
    X,
    Eye,
    EyeOff,
    Save,
    ChevronRight,
    Shield,
    AlertTriangle,
    Loader2,
    Receipt,
    Mail,
} from 'lucide-react'
import {
    changePassword,
    changeUsername,
    changeEmail,
    updateProfile,
    deleteAccount,
    updateNotificationPreferences,
    getCurrentProfile,
    checkUsernameAvailable,
    getUserDonations,
    type SettingsResult,
} from './actions'
import { validatePasswordStrength } from '@/lib/validations/auth-schemas'

// Debounce helper
function useDebounce<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay)
    }, [callback, delay]) as T
}

function PasswordRequirements({
    newPassword,
    passwordStrength,
}: {
    newPassword: string
    passwordStrength: ReturnType<typeof validatePasswordStrength>
}) {
    if (!newPassword) return null

    const { requirements } = passwordStrength
    const items = [
        { met: requirements.minLength, label: '8+ chars' },
        { met: requirements.hasUppercase, label: 'Uppercase' },
        { met: requirements.hasLowercase, label: 'Lowercase' },
        { met: requirements.hasNumber, label: 'Number' },
        { met: requirements.hasSpecial, label: 'Special' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 flex flex-wrap gap-1.5"
        >
            {items.map(({ met, label }) => (
                <span
                    key={label}
                    className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        met ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground/70'
                    }`}
                >
                    {met ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    {label}
                </span>
            ))}
        </motion.div>
    )
}

type Section = 'profile' | 'account' | 'security' | 'notifications' | 'billing' | 'danger'

type DonationRow = {
    id: string
    provider: string
    amount: number | null
    currency: string | null
    status: string | null
    created_at: string
}

interface ProfileData {
    id: string
    username: string
    display_name: string | null
    bio: string | null
    notification_preferences: {
        security_alerts: boolean
        email_updates: boolean
    } | null
}

interface UserData {
    id: string
    email: string | undefined
    isOAuthOnly: boolean
    oauthProvider: string | null
}

export default function SettingsPage() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState<Section>('profile')
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [user, setUser] = useState<UserData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Form states
    const [profileForm, setProfileForm] = useState({ displayName: '', bio: '' })
    const [usernameForm, setUsernameForm] = useState({ username: '' })
    const [emailForm, setEmailForm] = useState({ email: '' })
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    const [notificationForm, setNotificationForm] = useState({ securityAlerts: true, emailUpdates: true })
    const [deleteForm, setDeleteForm] = useState({ password: '', confirmText: '', acknowledged: false })
    const [donations, setDonations] = useState<DonationRow[]>([])
    const [donationsLoading, setDonationsLoading] = useState(false)

    // UI states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showDeletePassword, setShowDeletePassword] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
    const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''))
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch profile data
    useEffect(() => {
        async function loadProfile() {
            const result = await getCurrentProfile()
            if (result.error) {
                router.push('/login')
                return
            }
            if (result.profile && result.user) {
                setProfile(result.profile)
                setUser(result.user)
                setProfileForm({
                    displayName: result.profile.display_name || '',
                    bio: result.profile.bio || '',
                })
                setUsernameForm({ username: result.profile.username || '' })
                setNotificationForm({
                    securityAlerts: result.profile.notification_preferences?.security_alerts ?? true,
                    emailUpdates: result.profile.notification_preferences?.email_updates ?? true,
                })
            }
            setIsLoading(false)
        }
        loadProfile()
    }, [router])

    // Load payment history when Billing is opened
    useEffect(() => {
        if (activeSection !== 'billing') return
        let cancelled = false
        setDonationsLoading(true)
        getUserDonations().then((result) => {
            if (cancelled) return
            if (result.error) {
                setError(result.error)
            } else {
                setDonations(result.donations)
            }
            setDonationsLoading(false)
        })
        return () => { cancelled = true }
    }, [activeSection])

    // Debounced username check
    const checkUsername = useDebounce(async (username: string) => {
        if (username.length < 3 || username === profile?.username) {
            setUsernameStatus('idle')
            return
        }
        setUsernameStatus('checking')
        const result = await checkUsernameAvailable(username)
        setUsernameStatus(result.available ? 'available' : 'taken')
    }, 500)

    const handleResult = (result: SettingsResult) => {
        if (result.success) {
            setSuccess(result.message || 'Updated successfully')
            setError(null)
            // Refresh profile data
            getCurrentProfile().then(res => {
                if (res.profile) setProfile(res.profile)
            })
        } else {
            setError(result.error || 'An error occurred')
            setSuccess(null)
        }
        setIsSubmitting(false)
    }

    const clearMessages = () => {
        setError(null)
        setSuccess(null)
    }

    // Section navigation
    const sections = [
        { id: 'profile' as Section, label: 'Profile', icon: User },
        { id: 'account' as Section, label: 'Account', icon: AtSign },
        { id: 'security' as Section, label: 'Security', icon: Lock },
        { id: 'notifications' as Section, label: 'Notifications', icon: Bell },
        { id: 'billing' as Section, label: 'Payment History', icon: Receipt },
        { id: 'danger' as Section, label: 'Danger Zone', icon: Trash2, danger: true },
    ]

    const formatDonationAmount = (amount: number | null, currency: string | null) => {
        if (amount == null) return '—'
        const code = (currency || 'usd').toUpperCase()
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: code,
            }).format(amount)
        } catch {
            return `${amount} ${code}`
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-background overflow-hidden relative pt-4">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-1 py-3 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 md:mb-5"
                >
                    <h1 className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Settings
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage your account settings and preferences
                    </p>
                </motion.div>

                {/* Messages */}
                <AnimatePresence>
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${error
                                ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}
                        >
                            {error ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            <span className="text-sm">{error || success}</span>
                            <button
                                onClick={clearMessages}
                                className="ml-auto text-muted-foreground/80 hover:text-foreground"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid md:grid-cols-[240px_1fr] gap-6">
                    {/* Sidebar Navigation */}
                    <motion.nav
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border shadow-sm rounded-2xl p-3 h-fit"
                    >
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => { setActiveSection(section.id); clearMessages() }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                                    ? section.danger
                                        ? 'bg-destructive/10 text-destructive'
                                        : 'bg-primary/10 text-primary'
                                    : section.danger
                                        ? 'text-destructive/70 hover:text-destructive hover:bg-destructive/5'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
                            </button>
                        ))}
                    </motion.nav>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border shadow-sm rounded-2xl p-5 md:p-6"
                    >
                        <AnimatePresence mode="wait">
                            {/* Profile Section */}
                            {activeSection === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-foreground mb-1">Profile</h2>
                                    <p className="text-muted-foreground text-sm mb-4">Update your personal information</p>

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            setIsSubmitting(true)
                                            clearMessages()
                                            const formData = new FormData()
                                            formData.set('displayName', profileForm.displayName)
                                            formData.set('bio', profileForm.bio)
                                            const result = await updateProfile(formData)
                                            handleResult(result)
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                                            <Input
                                                value={profileForm.displayName}
                                                onChange={(e) => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                                                placeholder="Your display name"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Bio</label>
                                            <textarea
                                                value={profileForm.bio}
                                                onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                                maxLength={500}
                                                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground/70 text-right">{profileForm.bio.length}/500</p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Account Section */}
                            {activeSection === 'account' && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-foreground mb-1">Account</h2>
                                    <p className="text-muted-foreground text-sm mb-4">Manage your username and account details</p>

                                    {/* Email (read-only) */}
                                    <div className="mb-6 p-4 bg-muted/40 border border-border rounded-xl">
                                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                                        <p className="text-foreground mt-1">{user?.email}</p>
                                        {user?.isOAuthOnly && (
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                Authenticated via {user.oauthProvider} — your email is managed by your provider
                                            </p>
                                        )}
                                    </div>

                                    {/* Change email — hidden for OAuth-only accounts */}
                                    {user && !user.isOAuthOnly && (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault()
                                                setIsSubmitting(true)
                                                clearMessages()
                                                const formData = new FormData()
                                                formData.set('email', emailForm.email)
                                                const result = await changeEmail(formData)
                                                handleResult(result)
                                                if (result.success) setEmailForm({ email: '' })
                                            }}
                                            className="mb-6 space-y-4"
                                        >
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">New Email</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                                                    <Input
                                                        type="email"
                                                        value={emailForm.email}
                                                        onChange={(e) => setEmailForm({ email: e.target.value })}
                                                        placeholder="you@example.com"
                                                        className="bg-secondary/50 border-input pl-10 h-11 focus:border-primary focus:ring-primary/20"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground/70">
                                                    You&apos;ll need to confirm from both your current and new address before the change takes effect.
                                                </p>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || !emailForm.email || emailForm.email.trim().toLowerCase() === user.email?.toLowerCase()}
                                                className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2"
                                            >
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Update Email
                                            </Button>
                                        </form>
                                    )}

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            if (usernameStatus === 'taken') return
                                            setIsSubmitting(true)
                                            clearMessages()
                                            const formData = new FormData()
                                            formData.set('username', usernameForm.username)
                                            const result = await changeUsername(formData)
                                            handleResult(result)
                                        }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-muted-foreground">Username</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                <Input
                                                    value={usernameForm.username}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toLowerCase()
                                                        setUsernameForm({ username: val })
                                                        checkUsername(val)
                                                    }}
                                                    className={`pl-10 pr-10 h-11 ${usernameStatus === 'taken' ? 'border-destructive/60' :
                                                        usernameStatus === 'available' ? 'border-emerald-500/60' : ''
                                                        }`}
                                                />
                                                {usernameStatus !== 'idle' && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                                        {usernameStatus === 'available' && <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                                                        {usernameStatus === 'taken' && <X className="w-4 h-4 text-destructive" />}
                                                    </div>
                                                )}
                                            </div>
                                            {usernameStatus === 'taken' && (
                                                <p className="text-xs text-destructive">Username is already taken</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || usernameStatus === 'taken' || usernameForm.username === profile?.username}
                                            className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Update Username
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Security Section */}
                            {activeSection === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-foreground mb-1">Security</h2>
                                    <p className="text-muted-foreground text-sm mb-4">Update your password and security settings</p>

                                    {user?.isOAuthOnly ? (
                                        <div className="p-6 bg-muted/40 border border-border rounded-xl text-center">
                                            <Shield className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                            <h3 className="text-foreground font-medium mb-2">OAuth Account</h3>
                                            <p className="text-muted-foreground text-sm">
                                                You signed in with {user.oauthProvider}. Password management is handled by your provider.
                                            </p>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault()
                                                setIsSubmitting(true)
                                                clearMessages()
                                                const formData = new FormData()
                                                formData.set('currentPassword', passwordForm.currentPassword)
                                                formData.set('newPassword', passwordForm.newPassword)
                                                formData.set('confirmNewPassword', passwordForm.confirmNewPassword)
                                                const result = await changePassword(formData)
                                                if (result.success) {
                                                    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
                                                }
                                                handleResult(result)
                                            }}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                    <Input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                        className="pl-10 pr-10 h-11"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                    <Input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => {
                                                            setPasswordForm(p => ({ ...p, newPassword: e.target.value }))
                                                            setPasswordStrength(validatePasswordStrength(e.target.value))
                                                        }}
                                                        className="pl-10 pr-10 h-11"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                                                    >
                                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <PasswordRequirements
                                                    newPassword={passwordForm.newPassword}
                                                    passwordStrength={passwordStrength}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                                    <Input
                                                        type="password"
                                                        value={passwordForm.confirmNewPassword}
                                                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                                                        className={`pl-10 pr-10 h-11 ${passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword
                                                            ? 'border-destructive/60'
                                                            : passwordForm.confirmNewPassword && passwordForm.newPassword === passwordForm.confirmNewPassword
                                                                ? 'border-emerald-500/60' : ''
                                                            }`}
                                                        required
                                                    />
                                                    {passwordForm.confirmNewPassword && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            {passwordForm.newPassword === passwordForm.confirmNewPassword
                                                                ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                                                : <X className="w-4 h-4 text-destructive" />
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || !passwordStrength.isValid || passwordForm.newPassword !== passwordForm.confirmNewPassword}
                                                className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2"
                                            >
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                                Change Password
                                            </Button>
                                        </form>
                                    )}
                                </motion.div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-foreground mb-1">Notifications</h2>
                                    <p className="text-muted-foreground text-sm mb-4">Control your email notification preferences</p>

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            setIsSubmitting(true)
                                            clearMessages()
                                            const formData = new FormData()
                                            formData.set('securityAlerts', String(notificationForm.securityAlerts))
                                            formData.set('emailUpdates', String(notificationForm.emailUpdates))
                                            const result = await updateNotificationPreferences(formData)
                                            handleResult(result)
                                        }}
                                        className="space-y-4"
                                    >
                                        <label className="flex items-center justify-between p-4 bg-muted/40 border border-border rounded-xl cursor-pointer hover:bg-muted/70 transition-colors">
                                            <div>
                                                <p className="text-foreground font-medium">Security Alerts</p>
                                                <p className="text-muted-foreground text-sm">Get notified about password changes , new logins, and security events</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationForm.securityAlerts}
                                                onChange={(e) => setNotificationForm(n => ({ ...n, securityAlerts: e.target.checked }))}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-muted/40 border border-border rounded-xl cursor-pointer hover:bg-muted/70 transition-colors">
                                            <div>
                                                <p className="text-foreground font-medium">Email Updates</p>
                                                <p className="text-muted-foreground text-sm">Receive product updates, tips, and news</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationForm.emailUpdates}
                                                onChange={(e) => setNotificationForm(n => ({ ...n, emailUpdates: e.target.checked }))}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                        </label>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Preferences
                                        </Button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Payment History Section */}
                            {activeSection === 'billing' && (
                                <motion.div
                                    key="billing"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-foreground mb-1">Payment History</h2>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Donations made while signed in, plus any earlier donations that match your
                                        account&apos;s email. Fully anonymous gifts (different email, never linked) aren&apos;t listed here.
                                    </p>

                                    {donationsLoading ? (
                                        <div className="py-12 flex justify-center">
                                            <Loader2 className="w-6 h-6 text-muted-foreground/70 animate-spin" />
                                        </div>
                                    ) : donations.length === 0 ? (
                                        <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
                                            <Receipt className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                                            <p className="text-foreground/80 text-sm font-medium mb-1">No payments yet</p>
                                            <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                                                Donations made while logged in, or matching your account&apos;s email, will show up here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-border overflow-hidden">
                                            <div className="hidden sm:grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-3 px-4 py-2.5 text-[11px] uppercase tracking-wide text-muted-foreground/80 border-b border-border bg-muted/40">
                                                <span>Date</span>
                                                <span>Amount</span>
                                                <span>Status</span>
                                                <span>Method</span>
                                            </div>
                                            <ul className="divide-y divide-border">
                                                {donations.map((d) => (
                                                    <li
                                                        key={d.id}
                                                        className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_1fr_1fr] gap-1 sm:gap-3 px-4 py-3 text-sm"
                                                    >
                                                        <span className="text-foreground/80">
                                                            {new Date(d.created_at).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                        <span className="text-foreground font-medium">
                                                            {formatDonationAmount(d.amount, d.currency)}
                                                        </span>
                                                        <span className="text-muted-foreground capitalize">{d.status || '—'}</span>
                                                        <span className="text-muted-foreground capitalize">{d.provider}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Danger Zone Section */}
                            {activeSection === 'danger' && (
                                <motion.div
                                    key="danger"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-xl font-semibold text-destructive mb-1">Danger Zone</h2>
                                    <p className="text-muted-foreground text-sm mb-4">Irreversible actions that affect your account</p>

                                    <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-xl">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-destructive/10 rounded-xl">
                                                <AlertTriangle className="w-6 h-6 text-destructive" />
                                            </div>
                                            <div>
                                                <h3 className="text-foreground font-medium mb-1">Delete Account</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    Permanently delete your account, posts, comments, and uploaded media.
                                                    This cannot be undone. You can sign up again later with the same email.
                                                </p>
                                            </div>
                                        </div>

                                        {!showDeleteConfirm ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="h-11 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                I want to delete my account
                                            </Button>
                                        ) : (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault()
                                                setIsSubmitting(true)
                                                clearMessages()
                                                const formData = new FormData()
                                                if (!user?.isOAuthOnly) {
                                                    formData.set('password', deleteForm.password)
                                                }
                                                formData.set('confirmText', deleteForm.confirmText)
                                                formData.set('acknowledged', deleteForm.acknowledged ? 'true' : 'false')
                                                const result = await deleteAccount(formData)
                                                setIsSubmitting(false)
                                                if (result) handleResult(result)
                                            }}
                                            className="space-y-4"
                                        >
                                            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive/90 space-y-1">
                                                <p className="font-medium text-destructive">This is permanent.</p>
                                                <p>Your profile, posts, comments, reactions, and media files will be removed.</p>
                                            </div>

                                            {!user?.isOAuthOnly && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-muted-foreground">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive/50" />
                                                        <Input
                                                            type={showDeletePassword ? 'text' : 'password'}
                                                            value={deleteForm.password}
                                                            onChange={(e) => setDeleteForm(d => ({ ...d, password: e.target.value }))}
                                                            className="border-destructive/30 pl-10 pr-10 h-11 focus:border-destructive/60"
                                                            required={!user?.isOAuthOnly}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
                                                        >
                                                            {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">
                                                    Type <span className="text-destructive font-mono">DELETE</span> to confirm
                                                </label>
                                                <Input
                                                    value={deleteForm.confirmText}
                                                    onChange={(e) => setDeleteForm(d => ({ ...d, confirmText: e.target.value }))}
                                                    placeholder="DELETE"
                                                    className="border-destructive/30 h-11 focus:border-destructive/60"
                                                    required
                                                />
                                            </div>

                                            <label className="flex items-start gap-3 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={deleteForm.acknowledged}
                                                    onChange={(e) => setDeleteForm(d => ({ ...d, acknowledged: e.target.checked }))}
                                                    className="mt-0.5 h-4 w-4 accent-destructive cursor-pointer"
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    I understand this is irreversible and all my data will be permanently deleted.
                                                </span>
                                            </label>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowDeleteConfirm(false)
                                                        setDeleteForm({ password: '', confirmText: '', acknowledged: false })
                                                    }}
                                                    className="h-11 border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-xl"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isSubmitting ||
                                                        deleteForm.confirmText !== 'DELETE' ||
                                                        !deleteForm.acknowledged ||
                                                        (!user?.isOAuthOnly && !deleteForm.password)
                                                    }
                                                    className="h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl flex items-center gap-2 disabled:opacity-40"
                                                >
                                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    Permanently Delete Account
                                                </Button>
                                            </div>
                                        </form>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
