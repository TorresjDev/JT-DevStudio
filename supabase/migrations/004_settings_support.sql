-- Migration: Add notification preferences to profiles table
-- Adds JSONB column for storing user notification preferences

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  notification_preferences JSONB DEFAULT '{"security_alerts": true, "email_updates": true}'::jsonb;

-- Add index for efficient querying of notification preferences
CREATE INDEX IF NOT EXISTS idx_profiles_notification_preferences 
  ON profiles USING GIN (notification_preferences);

-- Comment for documentation
COMMENT ON COLUMN profiles.notification_preferences IS 'User notification preferences: security_alerts (boolean), email_updates (boolean)';
