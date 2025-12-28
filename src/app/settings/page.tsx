'use client'

import { useState, useEffect, useCallback } from 'react'
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
} from 'lucide-react'
import {
    changePassword,
    changeUsername,
    updateProfile,
    deleteAccount,
    updateNotificationPreferences,
    getCurrentProfile,
    checkUsernameAvailable,
    type SettingsResult,
} from './actions'
import { validatePasswordStrength } from '@/lib/validations/auth-schemas'

// Debounce helper
function useDebounce<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = { current: null as NodeJS.Timeout | null }

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay)
    }, [callback, delay]) as T
}

type Section = 'profile' | 'account' | 'security' | 'notifications' | 'danger'

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
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    const [notificationForm, setNotificationForm] = useState({ securityAlerts: true, emailUpdates: true })
    const [deleteForm, setDeleteForm] = useState({ password: '', confirmText: '' })

    // UI states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showDeletePassword, setShowDeletePassword] = useState(false)
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
        { id: 'danger' as Section, label: 'Danger Zone', icon: Trash2, danger: true },
    ]

    // Password requirements indicator
    const PasswordRequirements = () => {
        if (!passwordForm.newPassword) return null

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
                        className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${met
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-white/5 text-white/30'
                            }`}
                    >
                        {met ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                        {label}
                    </span>
                ))}
            </motion.div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative pt-16">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Settings
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
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
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                : 'bg-green-500/10 border border-green-500/20 text-green-400'
                                }`}
                        >
                            {error ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            <span className="text-sm">{error || success}</span>
                            <button
                                onClick={clearMessages}
                                className="ml-auto text-white/40 hover:text-white/60"
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
                        className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-3 h-fit"
                    >
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => { setActiveSection(section.id); clearMessages() }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                                    ? section.danger
                                        ? 'bg-red-500/10 text-red-400'
                                        : 'bg-blue-500/10 text-blue-400'
                                    : section.danger
                                        ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/5'
                                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
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
                        className="bg-white/3 backdrop-blur-xl border border-white/8 rounded-2xl p-6"
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
                                    <h2 className="text-xl font-semibold text-white mb-1">Profile</h2>
                                    <p className="text-white/40 text-sm mb-6">Update your personal information</p>

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
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-white/50">Display Name</label>
                                            <Input
                                                value={profileForm.displayName}
                                                onChange={(e) => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                                                placeholder="Your display name"
                                                className="bg-white/2 border-white/10 h-11"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-white/50">Bio</label>
                                            <textarea
                                                value={profileForm.bio}
                                                onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                                maxLength={500}
                                                className="w-full bg-white/2 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 resize-none"
                                            />
                                            <p className="text-xs text-white/30 text-right">{profileForm.bio.length}/500</p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2"
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
                                    <h2 className="text-xl font-semibold text-white mb-1">Account</h2>
                                    <p className="text-white/40 text-sm mb-6">Manage your username and account details</p>

                                    {/* Email (read-only) */}
                                    <div className="mb-6 p-4 bg-white/2 border border-white/10 rounded-xl">
                                        <label className="text-xs font-medium text-white/50">Email</label>
                                        <p className="text-white mt-1">{user?.email}</p>
                                        {user?.isOAuthOnly && (
                                            <p className="text-xs text-white/30 mt-1">
                                                Authenticated via {user.oauthProvider}
                                            </p>
                                        )}
                                    </div>

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
                                        className="space-y-5"
                                    >
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-white/50">Username</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                <Input
                                                    value={usernameForm.username}
                                                    onChange={(e) => {
                                                        const val = e.target.value.toLowerCase()
                                                        setUsernameForm({ username: val })
                                                        checkUsername(val)
                                                    }}
                                                    className={`bg-white/2 border-white/10 pl-10 pr-10 h-11 ${usernameStatus === 'taken' ? 'border-red-500/50' :
                                                        usernameStatus === 'available' ? 'border-green-500/50' : ''
                                                        }`}
                                                />
                                                {usernameStatus !== 'idle' && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-white/40" />}
                                                        {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-400" />}
                                                        {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-400" />}
                                                    </div>
                                                )}
                                            </div>
                                            {usernameStatus === 'taken' && (
                                                <p className="text-xs text-red-400">Username is already taken</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || usernameStatus === 'taken' || usernameForm.username === profile?.username}
                                            className="h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2"
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
                                    <h2 className="text-xl font-semibold text-white mb-1">Security</h2>
                                    <p className="text-white/40 text-sm mb-6">Update your password and security settings</p>

                                    {user?.isOAuthOnly ? (
                                        <div className="p-6 bg-white/2 border border-white/10 rounded-xl text-center">
                                            <Shield className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                            <h3 className="text-white font-medium mb-2">OAuth Account</h3>
                                            <p className="text-white/40 text-sm">
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
                                            className="space-y-5"
                                        >
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-white/50">Current Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <Input
                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                                                        className="bg-white/2 border-white/10 pl-10 pr-10 h-11"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-white/50">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <Input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => {
                                                            setPasswordForm(p => ({ ...p, newPassword: e.target.value }))
                                                            setPasswordStrength(validatePasswordStrength(e.target.value))
                                                        }}
                                                        className="bg-white/2 border-white/10 pl-10 pr-10 h-11"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                                    >
                                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                <PasswordRequirements />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-white/50">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                    <Input
                                                        type="password"
                                                        value={passwordForm.confirmNewPassword}
                                                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                                                        className={`bg-white/2 border-white/10 pl-10 pr-10 h-11 ${passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword
                                                            ? 'border-red-500/50'
                                                            : passwordForm.confirmNewPassword && passwordForm.newPassword === passwordForm.confirmNewPassword
                                                                ? 'border-green-500/50' : ''
                                                            }`}
                                                        required
                                                    />
                                                    {passwordForm.confirmNewPassword && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            {passwordForm.newPassword === passwordForm.confirmNewPassword
                                                                ? <Check className="w-4 h-4 text-green-400" />
                                                                : <X className="w-4 h-4 text-red-400" />
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || !passwordStrength.isValid || passwordForm.newPassword !== passwordForm.confirmNewPassword}
                                                className="h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2"
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
                                    <h2 className="text-xl font-semibold text-white mb-1">Notifications</h2>
                                    <p className="text-white/40 text-sm mb-6">Control your email notification preferences</p>

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
                                        <label className="flex items-center justify-between p-4 bg-white/2 border border-white/10 rounded-xl cursor-pointer hover:bg-white/3 transition-colors">
                                            <div>
                                                <p className="text-white font-medium">Security Alerts</p>
                                                <p className="text-white/40 text-sm">Get notified about password changes , new logins, and security events</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationForm.securityAlerts}
                                                onChange={(e) => setNotificationForm(n => ({ ...n, securityAlerts: e.target.checked }))}
                                                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-4 bg-white/2 border border-white/10 rounded-xl cursor-pointer hover:bg-white/3 transition-colors">
                                            <div>
                                                <p className="text-white font-medium">Email Updates</p>
                                                <p className="text-white/40 text-sm">Receive product updates, tips, and news</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationForm.emailUpdates}
                                                onChange={(e) => setNotificationForm(n => ({ ...n, emailUpdates: e.target.checked }))}
                                                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/20"
                                            />
                                        </label>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Preferences
                                        </Button>
                                    </form>
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
                                    <h2 className="text-xl font-semibold text-red-400 mb-1">Danger Zone</h2>
                                    <p className="text-white/40 text-sm mb-6">Irreversible actions that affect your account</p>

                                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-red-500/10 rounded-xl">
                                                <AlertTriangle className="w-6 h-6 text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium mb-1">Delete Account</h3>
                                                <p className="text-white/40 text-sm">
                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>

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
                                                const result = await deleteAccount(formData)
                                                handleResult(result)
                                            }}
                                            className="space-y-4"
                                        >
                                            {!user?.isOAuthOnly && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-medium text-white/50">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400/40" />
                                                        <Input
                                                            type={showDeletePassword ? 'text' : 'password'}
                                                            value={deleteForm.password}
                                                            onChange={(e) => setDeleteForm(d => ({ ...d, password: e.target.value }))}
                                                            className="bg-white/2 border-red-500/20 pl-10 pr-10 h-11 focus:border-red-500/50"
                                                            required={!user?.isOAuthOnly}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                                        >
                                                            {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-white/50">
                                                    Type <span className="text-red-400 font-mono">DELETE</span> to confirm
                                                </label>
                                                <Input
                                                    value={deleteForm.confirmText}
                                                    onChange={(e) => setDeleteForm(d => ({ ...d, confirmText: e.target.value }))}
                                                    placeholder="DELETE"
                                                    className="bg-white/2 border-red-500/20 h-11 focus:border-red-500/50"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting || deleteForm.confirmText !== 'DELETE' || (!user?.isOAuthOnly && !deleteForm.password)}
                                                className="h-11 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center gap-2"
                                            >
                                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                Delete My Account
                                            </Button>
                                        </form>
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
