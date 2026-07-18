import { describe, expect, it } from 'vitest'
import {
  getOAuthErrorMessage,
  mapProviderErrorToCode,
} from '@/lib/auth/oauth-errors'

describe('oauth-errors', () => {
  it('maps cancelled / denied to oauth_cancelled', () => {
    expect(mapProviderErrorToCode('access_denied', null)).toBe('oauth_cancelled')
  })

  it('maps deleted_client to oauth_provider (friendly, not raw)', () => {
    expect(
      mapProviderErrorToCode('server_error', 'Error 401: deleted_client')
    ).toBe('oauth_provider')
    const message = getOAuthErrorMessage('oauth_provider')
    expect(message).toBeTruthy()
    expect(message).not.toMatch(/deleted_client/i)
  })

  it('returns null for missing codes', () => {
    expect(getOAuthErrorMessage(null)).toBeNull()
  })
})
