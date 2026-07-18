import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import {
  loginOAuthErrorUrl,
  mapProviderErrorToCode,
} from '@/lib/auth/oauth-errors'

function isSafeHost(host: string | null): boolean {
  if (!host) return false
  // Allow localhost
  if (host === 'localhost' || host.startsWith('localhost:')) return true

  // Allow configured site URL
  const siteUrl = process.env.SITE_URL
  if (siteUrl) {
    try {
      const siteHost = new URL(siteUrl).host
      if (host === siteHost) return true
    } catch {
      // ignore malformed SITE_URL
    }
  }

  // Allow Vercel preview deploys (e.g. *.vercel.app)
  if (host.endsWith('.vercel.app')) return true

  return false
}

function resolveRedirectBase(request: Request, origin: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  if (isLocalEnv) return origin
  if (forwardedHost && isSafeHost(forwardedHost)) return `https://${forwardedHost}`
  return origin
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const providerError = searchParams.get('error')
  const providerDescription =
    searchParams.get('error_description') ?? searchParams.get('error_code')

  // Validate next param to prevent open redirect attacks
  // Must start with / but not // (which would be interpreted as protocol-relative URL)
  const nextParam = searchParams.get('next')
  const next =
    nextParam?.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/'

  const base = resolveRedirectBase(request, origin)

  // Provider sent an error back (cancelled, misconfigured client, etc.)
  if (providerError) {
    const codeKey = mapProviderErrorToCode(providerError, providerDescription)
    return NextResponse.redirect(`${base}${loginOAuthErrorUrl(base, codeKey)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${base}${next}`)
    }
  }

  // Password-recovery links that fail (expired/invalid code) should land on the
  // reset page, which already has a clear "request a new link" state.
  if (next === '/reset-password') {
    return NextResponse.redirect(`${base}/reset-password`)
  }

  // Session exchange failed or code missing — friendly login error, not a raw dump
  return NextResponse.redirect(
    `${base}${loginOAuthErrorUrl(base, code ? 'oauth_exchange' : 'oauth_unknown')}`
  )
}
