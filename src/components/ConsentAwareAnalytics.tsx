'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'
import {
  getStoredCookieConsent,
  type CookieConsentValue,
} from '@/components/CookieConsent'

/**
 * Loads Vercel Analytics only after the visitor accepts non-essential cookies.
 */
export function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = (value: CookieConsentValue | null = getStoredCookieConsent()) => {
      setEnabled(value === 'accepted')
    }

    sync()

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentValue>).detail
      sync(detail)
    }

    window.addEventListener('cookie-consent', onConsent)
    return () => window.removeEventListener('cookie-consent', onConsent)
  }, [])

  if (!enabled) return null
  return <Analytics />
}
