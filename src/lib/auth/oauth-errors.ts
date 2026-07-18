/**
 * Safe, user-facing messages for OAuth / auth-callback failures.
 * Never surface raw provider error strings (they can be scary or leak config).
 */

export type OAuthErrorCode =
  | 'oauth_cancelled'
  | 'oauth_provider'
  | 'oauth_exchange'
  | 'oauth_config'
  | 'oauth_unknown'

const MESSAGES: Record<OAuthErrorCode, string> = {
  oauth_cancelled: 'Sign-in was cancelled. You can try again whenever you\'re ready.',
  oauth_provider:
    'That sign-in provider is unavailable right now. Please use email/password or GitHub, or try again later.',
  oauth_exchange:
    'We couldn\'t complete sign-in. The link may have expired — please try again.',
  oauth_config:
    'Sign-in isn\'t configured correctly right now. Please use email/password or try another provider.',
  oauth_unknown: 'Something went wrong during sign-in. Please try again.',
}

export function getOAuthErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null
  if (code in MESSAGES) return MESSAGES[code as OAuthErrorCode]
  return MESSAGES.oauth_unknown
}

/**
 * Map Supabase/provider query params onto a safe app error code.
 */
export function mapProviderErrorToCode(
  error: string | null,
  description: string | null = null
): OAuthErrorCode {
  const combined = `${error ?? ''} ${description ?? ''}`.toLowerCase()

  if (
    error === 'access_denied' ||
    combined.includes('access_denied') ||
    combined.includes('user_cancelled') ||
    combined.includes('consent_required')
  ) {
    return 'oauth_cancelled'
  }

  if (
    combined.includes('deleted_client') ||
    combined.includes('invalid_client') ||
    combined.includes('unauthorized_client') ||
    combined.includes('invalid_client_id')
  ) {
    return 'oauth_provider'
  }

  if (error === 'server_error' || error === 'temporarily_unavailable') {
    return 'oauth_provider'
  }

  return 'oauth_unknown'
}

export function loginOAuthErrorUrl(origin: string, code: OAuthErrorCode): string {
  const url = new URL('/login', origin)
  url.searchParams.set('error', code)
  return url.pathname + url.search
}
