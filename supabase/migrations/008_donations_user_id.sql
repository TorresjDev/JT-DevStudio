-- =============================================================================
-- Link donations to logged-in users (nullable for anonymous gifts)
-- =============================================================================

ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON public.donations(user_id);

-- Users can read only their own linked donations (anonymous rows stay invisible)
DROP POLICY IF EXISTS "Users can read own donations" ON public.donations;
CREATE POLICY "Users can read own donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
