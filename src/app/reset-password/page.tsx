'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { updatePasswordFromRecovery, type AuthResult } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/client'
import { validatePasswordStrength } from '@/lib/validations/auth-schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Lock,
  LockKeyhole,
  AlertCircle,
  Check,
  X,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

type PageState = 'checking' | 'ready' | 'invalid' | 'success'

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('checking')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''))

  // The recovery link lands on /auth/callback which exchanges the code for a
  // session, then redirects here. No session means the link was bad/expired.
  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    async function verifySession() {
      const { data } = await supabase.auth.getUser()
      if (!cancelled) {
        setPageState(data.user ? 'ready' : 'invalid')
      }
    }

    void verifySession()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    const formData = new FormData()
    formData.set('password', password)
    formData.set('confirmPassword', confirmPassword)

    try {
      const result: AuthResult = await updatePasswordFromRecovery(formData)
      if (result.success) {
        setPageState('success')
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const requirementItems = [
    { met: passwordStrength.requirements.minLength, label: '8+ characters' },
    { met: passwordStrength.requirements.hasUppercase, label: 'Uppercase' },
    { met: passwordStrength.requirements.hasLowercase, label: 'Lowercase' },
    { met: passwordStrength.requirements.hasNumber, label: 'Number' },
    { met: passwordStrength.requirements.hasSpecial, label: 'Special (@$!%*?&)' },
  ]

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="glass-panel rounded-3xl p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

          {pageState === 'checking' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Verifying your reset link...</p>
            </div>
          )}

          {pageState === 'invalid' && (
            <div className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">Link Invalid or Expired</h1>
              <p className="text-muted-foreground text-sm mb-6">
                This password reset link is no longer valid. Reset links expire after a short
                time for security. Request a new one below.
              </p>
              <Link href="/forgot-password">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Request New Reset Link
                </Button>
              </Link>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {pageState === 'success' && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-3">Password Updated</h1>
              <p className="text-muted-foreground text-sm mb-6">
                Your password has been changed successfully. You&apos;re signed in and ready to go.
              </p>
              <Link href="/">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group">
                  Continue to Dev Studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          )}

          {pageState === 'ready' && (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Set New Password</h1>
                <p className="text-muted-foreground text-sm">
                  Choose a strong password for your account.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordStrength(validatePasswordStrength(e.target.value))
                      }}
                      required
                      autoFocus
                      className="bg-secondary/50 border-input pl-10 pr-10 h-12 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {requirementItems.map(({ met, label }) => (
                        <span
                          key={label}
                          className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            met ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground/70'
                          }`}
                        >
                          {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`bg-secondary/50 border-input pl-10 pr-16 h-12 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-destructive/60'
                          : confirmPassword && password === confirmPassword
                            ? 'border-emerald-500/60'
                            : ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {confirmPassword && (
                        password === confirmPassword ? (
                          <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground/70 hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !passwordStrength.isValid || password !== confirmPassword}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
