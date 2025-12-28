'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup, signInWithGithub, signInWithGoogle, checkUsernameAvailability, type AuthResult } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  LogIn,
  UserPlus,
  Github,
  Mail,
  Lock,
  AlertCircle,
  User,
  AtSign,
  Check,
  X,
  MailCheck,
  LockKeyhole,
  Eye,
  EyeOff
} from 'lucide-react'
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

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form field states for validation
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  })

  // Validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''))

  // Debounced username check
  const checkUsername = useDebounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    const result = await checkUsernameAvailability(username)
    setUsernameStatus(result.available ? 'available' : 'taken')
  }, 500)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (field === 'username' && !isLogin) {
      checkUsername(value)
    }

    if (field === 'password') {
      setPasswordStrength(validatePasswordStrength(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Client-side validation for signup
    if (!isLogin) {
      if (formData.email !== formData.confirmEmail) {
        setError('Email addresses do not match')
        setIsLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }
      if (usernameStatus === 'taken') {
        setError('Username is already taken')
        setIsLoading(false)
        return
      }
    }

    const submitData = new FormData()
    submitData.set('email', formData.email)
    submitData.set('password', formData.password)

    if (!isLogin) {
      submitData.set('fullName', formData.fullName)
      submitData.set('username', formData.username)
    }

    const action = isLogin ? login : signup

    try {
      const result: AuthResult = await action(submitData)

      if (result.success && result.redirectTo) {
        window.location.href = result.redirectTo
      } else if (result.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch {
      setError('An unexpected error occurred')
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setFormData({
      fullName: '',
      username: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    })
    setUsernameStatus('idle')
    setPasswordStrength(validatePasswordStrength(''))
  }

  // Password requirements indicator
  const PasswordRequirements = () => {
    if (isLogin || !formData.password) return null

    const { requirements } = passwordStrength
    const items = [
      { met: requirements.minLength, label: '8+ characters' },
      { met: requirements.hasUppercase, label: 'Uppercase' },
      { met: requirements.hasLowercase, label: 'Lowercase' },
      { met: requirements.hasNumber, label: 'Number' },
      { met: requirements.hasSpecial, label: 'Special (@$!%*?&)' },
    ]

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-2 flex flex-wrap gap-2"
      >
        {items.map(({ met, label }) => (
          <span
            key={label}
            className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${met
                ? 'bg-green-500/10 text-green-400'
                : 'bg-white/5 text-white/30'
              }`}
          >
            {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {label}
          </span>
        ))}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="bg-white/3 backdrop-blur-xl border-white/8 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          {/* Subtle line effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

          <div className="text-center mb-8">
            <motion.h1
              key={isLogin ? 'login-head' : 'signup-head'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent mb-2"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
            <p className="text-white/40 text-sm">
              {isLogin ? 'Enter your credentials to continue' : 'Join us and start your journey today'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup-only fields */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/50 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required={!isLogin}
                        className="bg-white/2 border-white/10 pl-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/50 ml-1">Username</label>
                    <div className="relative group">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                        required={!isLogin}
                        className={`bg-white/2 border-white/10 pl-10 pr-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 ${usernameStatus === 'taken' ? 'border-red-500/50' :
                            usernameStatus === 'available' ? 'border-green-500/50' : ''
                          }`}
                      />
                      {usernameStatus !== 'idle' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameStatus === 'checking' && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          )}
                          {usernameStatus === 'available' && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                          {usernameStatus === 'taken' && (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {usernameStatus === 'taken' && (
                      <p className="text-xs text-red-400 ml-1">Username is already taken</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/50 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="bg-white/2 border-white/10 pl-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Confirm Email (signup only) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-medium text-white/50 ml-1">Confirm Email</label>
                  <div className="relative group">
                    <MailCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      name="confirmEmail"
                      type="email"
                      placeholder="Confirm your email"
                      value={formData.confirmEmail}
                      onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
                      required={!isLogin}
                      className={`bg-white/2 border-white/10 pl-10 pr-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 ${formData.confirmEmail && formData.email !== formData.confirmEmail
                          ? 'border-red-500/50'
                          : formData.confirmEmail && formData.email === formData.confirmEmail
                            ? 'border-green-500/50'
                            : ''
                        }`}
                    />
                    {formData.confirmEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {formData.email === formData.confirmEmail ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/50 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="bg-white/2 border-white/10 pl-10 pr-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordRequirements />
            </div>

            {/* Confirm Password (signup only) */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-medium text-white/50 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required={!isLogin}
                      className={`bg-white/2 border-white/10 pl-10 pr-10 h-12 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 ${formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500/50'
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                            ? 'border-green-500/50'
                            : ''
                        }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {formData.confirmPassword && (
                        formData.password === formData.confirmPassword ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-400" />
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isLoading || (!isLogin && usernameStatus === 'taken')}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 group mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121212] px-2 text-white/30">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <form action={signInWithGithub}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11 bg-white/2 border-white/10 hover:bg-white/5 hover:border-white/20 text-white/80 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </form>
              <form action={signInWithGoogle}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full h-11 bg-white/2 border-white/10 hover:bg-white/5 hover:border-white/20 text-white/80 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {/* Google Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-white/40 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
