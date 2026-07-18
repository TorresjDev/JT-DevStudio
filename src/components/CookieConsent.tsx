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
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-md shadow-xl shadow-black/40 p-4">
            <p className="text-sm text-white/80 leading-relaxed mb-3">
              We use essential cookies for sign-in and security. Optional analytics
              help us improve the site — no ads, no sale of your data.{' '}
              <Link
                href="/privacy-policy#cookies"
                className="text-[#DAA520] hover:underline underline-offset-2"
              >
                Privacy policy
              </Link>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => persist('essential')}
                className="h-9 rounded-xl border-white/15 bg-transparent text-white/70 hover:bg-white/5 hover:text-white text-sm"
              >
                Essential only
              </Button>
              <Button
                type="button"
                onClick={() => persist('accepted')}
                className="h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm"
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
