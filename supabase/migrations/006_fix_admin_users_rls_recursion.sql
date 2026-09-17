-- Fix: infinite recursion detected in policy for relation "admin_users"
-- Cause: policies that SELECT from admin_users while evaluating admin_users RLS.
-- Run this entire script in Supabase SQL Editor.

-- 1. is_admin() must be SECURITY DEFINER so it bypasses RLS when checking admin_users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE auth_user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 2. Categories / products / enquiries / customers / settings — use is_admin(), not subquery
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories" ON categories
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products" ON products
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin full access enquiries" ON enquiries;
CREATE POLICY "Admin full access enquiries" ON enquiries
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin full access customers" ON customers;
CREATE POLICY "Admin full access customers" ON customers
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin can update settings" ON website_settings;
CREATE POLICY "Admin can update settings" ON website_settings
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. admin_users — never subquery admin_users inside its own policies
DROP POLICY IF EXISTS "Admin can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin can view admin users" ON admin_users;

-- Users always read their own row (login check via rpc still uses is_admin())
DROP POLICY IF EXISTS "Users can read own admin record" ON admin_users;
CREATE POLICY "Users can read own admin record" ON admin_users
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- Admins manage other admin rows via is_admin() (no recursion)
CREATE POLICY "Admin can manage admin users" ON admin_users
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
