-- Fix admin login — run once in Supabase → SQL Editor
-- 1. Ensures service_role can manage admin_users
-- 2. Links your auth user to admin_users (update email/UUID if needed)

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

INSERT INTO admin_users (auth_user_id, name, email, role)
VALUES (
  '36b7dcda-f71f-4b0a-8651-89d04ebea098',
  'Admin',
  'primecrackerssivakasi@gmail.com',
  'admin'
)
ON CONFLICT (auth_user_id) DO UPDATE
SET name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role;

-- Verify (should return one row):
-- SELECT * FROM admin_users WHERE email = 'primecrackerssivakasi@gmail.com';
