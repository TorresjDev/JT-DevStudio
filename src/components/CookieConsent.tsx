'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'jt-cookie-consent'

export type CookieConsentValue = 'accepted' | 'essential'

export function getStoredCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'accepted' || value === 'essential') return value
  } catch {
    // private mode / blocked storage
  }
  return null
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getStoredCookieConsent() === null)
  }, [])

  const persist = (value: CookieConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore
    }
    setVisible(false)
    // Let analytics / other listeners react without a full reload
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: value }))
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-lg md:bottom-4 md:left-auto md:right-4 pointer-events-auto"
        >
          <div className="rounded-2xl border border-border/50 bg-background/40 p-4 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-card/35 dark:shadow-black/45">
            <p className="text-sm text-foreground/90 leading-relaxed mb-3">
              We use essential cookies for sign-in and security. Optional analytics
              help us improve the site — no ads, no sale of your data.{' '}
              <Link
                href="/privacy-policy#cookies"
                className="text-goldenrod-dark dark:text-goldenrod hover:underline underline-offset-2"
              >
                Privacy policy
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => persist('essential')}
                className="h-9 rounded-xl border-border/70 bg-background/30 text-muted-foreground backdrop-blur-sm hover:bg-accent/60 hover:text-foreground text-sm"
              >
                Essential only
              </Button>
              <Button
                type="button"
                onClick={() => persist('accepted')}
                className="h-9 rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground text-sm shadow-sm"
              >
                Accept analytics
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
