import 'server-only'

import { createServiceClient } from '@/utils/supabase/service'

export type DonationRecord = {
  provider: string
  provider_event_id: string
  amount?: number | null
  currency?: string | null
  status?: string | null
  email?: string | null
}

export function requireWebhookSecret(
  secret: string | undefined,
  envName: string
): string | Response {
  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(`${envName} is not configured in production`)
    return new Response(
      JSON.stringify({ error: 'Webhook signing secret is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  console.warn(
    `${envName} is not configured. Webhook signature verification is disabled.`
  )
  return ''
}

export async function recordDonation(
  donation: DonationRecord
): Promise<{ duplicate: boolean }> {
  const supabase = createServiceClient()

  const { error } = await supabase.from('donations').insert(donation)

  if (error?.code === '23505') {
    return { duplicate: true }
  }

  if (error) {
    console.error('Failed to record donation:', error)
    throw new Error('Failed to persist donation')
  }

  return { duplicate: false }
}
