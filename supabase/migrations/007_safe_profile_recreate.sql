-- =============================================================================
-- Safe profile creation on signup / re-signup
-- =============================================================================
-- handle_new_user previously used a bare INSERT. If a profile row somehow
-- remained, or username collided, signup/re-signup could fail. Use upsert on
-- id and fall back to a unique username suffix on unique_violation.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username text;
  final_username text;
BEGIN
  base_username := LOWER(COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'preferred_username',
    SPLIT_PART(NEW.email, '@', 1)
  ));

  -- Keep within username length constraints (3-20)
  base_username := LEFT(REGEXP_REPLACE(COALESCE(base_username, 'user'), '[^a-z0-9_]', '', 'g'), 20);
  IF base_username IS NULL OR LENGTH(base_username) < 3 THEN
    base_username := 'user' || SUBSTR(REPLACE(NEW.id::text, '-', ''), 1, 8);
  END IF;
  -- Must start with a letter for app validation; pad if needed
  IF base_username !~ '^[a-z]' THEN
    base_username := 'u' || LEFT(base_username, 19);
  END IF;

  final_username := base_username;

  BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
      NEW.id,
      final_username,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name'
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = NOW();
  EXCEPTION WHEN unique_violation THEN
    -- Username taken by another profile: append short id suffix
    final_username := LEFT(base_username, 13) || '_' || SUBSTR(REPLACE(NEW.id::text, '-', ''), 1, 6);
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
      NEW.id,
      final_username,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name'
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      )
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = NOW();
  END;

  RETURN NEW;
END;
$$;
