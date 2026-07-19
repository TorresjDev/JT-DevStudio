'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function ConfirmEmailContent() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const supabase = createClient()

    const handleResend = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'Email not found. Please try signing up again.' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Confirmation email resent successfully!' })
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to resend confirmation email.'
            setMessage({ type: 'error', text: message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md p-8 relative z-10"
        >
            <div className="glass-panel rounded-3xl p-8 overflow-hidden relative text-center">
                {/* Subtle line effect */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

                {/* Animated Mail Icon */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                    }}
                    className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                >
                    <motion.div
                        animate={{
                            y: [0, -4, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Mail className="w-10 h-10 text-primary" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent mb-3"
                >
                    Check Your Email
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground mb-6"
                >
                    We&apos;ve sent a confirmation link to {email ? <span className="text-foreground font-medium">{email}</span> : 'your email address'}.
                    Click the link to verify your account and get started.
                </motion.p>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Info Box */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-muted/40 border border-border rounded-xl p-4 mb-6 text-left"
                >
                    <h3 className="text-sm font-medium text-foreground/90 mb-2">What to do next:</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">1.</span>
                            <span>Open your email inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">2.</span>
                            <span>Look for an email from Dev Studio</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">3.</span>
                            <span>Click the confirmation link in the email</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Help text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-muted-foreground/80 mb-6"
                >
                    <p>
                        Didn&apos;t receive the email? Check your spam folder or{' '}
                        <button
                            onClick={handleResend}
                            disabled={isLoading}
                            className="text-primary hover:text-primary/80 underline-offset-2 hover:underline inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                            resend confirmation
                        </button>
                    </p>
                </motion.div>

                {/* Back to login */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/login">
                        <Button
                            variant="outline"
                            className="w-full h-11 bg-secondary/50 border-input hover:bg-secondary hover:border-primary/20 text-foreground rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default function ConfirmEmailPage() {
    return (
        <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <Suspense fallback={<div className="text-muted-foreground/80">Loading...</div>}>
                <ConfirmEmailContent />
            </Suspense>
        </div>
    )
}
