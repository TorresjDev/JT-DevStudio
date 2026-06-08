import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requireWebhookSecret } from '@/lib/webhook-secrets'

describe('requireWebhookSecret', () => {
  const originalEnv = process.env.NODE_ENV

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', originalEnv)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns the secret when configured', () => {
    expect(requireWebhookSecret('whsec_test', 'STRIPE_WEBHOOK_SECRET')).toBe(
      'whsec_test'
    )
  })

  it('rejects missing secret in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    const result = requireWebhookSecret(undefined, 'STRIPE_WEBHOOK_SECRET')

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(500)
  })

  it('allows missing secret outside production', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(requireWebhookSecret(undefined, 'STRIPE_WEBHOOK_SECRET')).toBe('')
  })
})
