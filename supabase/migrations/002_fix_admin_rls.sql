-- Fix: Allow logged-in users to check their own admin status
-- Run this in Supabase SQL Editor

CREATE POLICY "Users can read own admin record" ON admin_users
  FOR SELECT USING (auth_user_id = auth.uid());

-- Verify auth UUID matches admin_users (run and check results)
SELECT
  au.id AS auth_uuid,
  au.email AS auth_email,
  ad.auth_user_id AS admin_auth_uuid,
  ad.email AS admin_email,
  CASE WHEN au.id = ad.auth_user_id THEN 'MATCH ✓' ELSE 'MISMATCH ✗' END AS status
FROM auth.users au
LEFT JOIN admin_users ad ON ad.email = au.email
WHERE au.email = 'founder@ihtrad.com';
