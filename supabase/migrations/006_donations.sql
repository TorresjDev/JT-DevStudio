-- Migration: Donation webhook records
-- Persists verified Stripe and Coinbase donation events (service-role writes only).

CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  amount NUMERIC,
  currency TEXT,
  status TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_event_id)
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
