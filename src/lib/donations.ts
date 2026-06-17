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

export class DatabaseError extends Error {
  supabaseError: unknown
  constructor(message: string, supabaseError: unknown) {
    super(message)
    this.name = 'DatabaseError'
    this.supabaseError = supabaseError
  }
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
    throw new DatabaseError('Failed to persist donation', error)
  }

  return { duplicate: false }
}

