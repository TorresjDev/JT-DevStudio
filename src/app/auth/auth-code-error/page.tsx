import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Legacy fallback if something still deep-links here.
 * Primary OAuth failures now redirect to /login?error=...
 */
export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background overflow-hidden relative p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-3xl p-8 text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Sign-in interrupted</h1>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn&apos;t finish signing you in. This is often a cancelled or expired
            attempt — try again with email, GitHub, or Google.
          </p>
          <Link href="/login">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
