-- Fix: logged-in customers could not submit contact/cart enquiries (RLS blocked INSERT).
-- Error shown: "new row violates row-level security policy for table enquiries"
--
-- Cause: after admin policies were scoped to authenticated role, the public INSERT
-- policy was missing or not applied for authenticated users in production.
--
-- Run in Supabase SQL Editor if migration 015 was not applied via CLI.

DROP POLICY IF EXISTS "Public can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Anyone can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated users can create enquiries" ON enquiries;

-- Anonymous visitors (contact form, cart enquiry while logged out)
CREATE POLICY "Anyone can create enquiries" ON enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    auth_user_id IS NULL OR auth_user_id = auth.uid()
  );

-- Explicit read for anon is not needed; authenticated users already have migration 012 policy.

GRANT INSERT ON enquiries TO anon, authenticated;
