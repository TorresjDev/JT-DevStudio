import { describe, expect, it } from 'vitest'
import { changeEmailSchema } from '@/lib/validations/auth-schemas'

describe('changeEmailSchema', () => {
  it('accepts a valid email and lowercases it', () => {
    const result = changeEmailSchema.safeParse({ email: 'JT.Dev@Example.COM' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('jt.dev@example.com')
    }
  })

  it('rejects an invalid email format', () => {
    const result = changeEmailSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty email', () => {
    const result = changeEmailSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })

  it('rejects emails longer than 254 characters', () => {
    const local = 'a'.repeat(250)
    const result = changeEmailSchema.safeParse({ email: `${local}@example.com` })
    expect(result.success).toBe(false)
  })

  it('rejects a missing email field', () => {
    const result = changeEmailSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
