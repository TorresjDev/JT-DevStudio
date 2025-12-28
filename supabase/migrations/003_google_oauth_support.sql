-- =============================================================================
-- Migration: Update Profile Trigger for Google OAuth Support
-- =============================================================================
-- 
-- This migration updates the handle_new_user() trigger function to support:
-- 1. Manual signup with full_name and user_name from form data
-- 2. GitHub OAuth (user_name, full_name, avatar_url)
-- 3. Google OAuth (name, picture - different metadata keys)
--
-- HOW TO APPLY:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Paste this entire file
-- 4. Click "Run"
--
-- =============================================================================

-- Update trigger to handle all OAuth provider metadata formats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    -- Username priority: 
    -- 1. Manual signup / GitHub (user_name)
    -- 2. OAuth preferred_username
    -- 3. Fall back to email prefix
    LOWER(COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'preferred_username',
      SPLIT_PART(NEW.email, '@', 1)
    )),
    -- Display name priority:
    -- 1. Manual signup (full_name)
    -- 2. Google/GitHub OAuth (name)
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    -- Avatar URL priority:
    -- 1. GitHub (avatar_url)
    -- 2. Google (picture)
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- DONE! ✅
-- =============================================================================
-- The trigger now supports:
-- • Manual email/password signups with full name and username
-- • GitHub OAuth (extracts user_name, full_name, avatar_url)
-- • Google OAuth (extracts name, picture)
