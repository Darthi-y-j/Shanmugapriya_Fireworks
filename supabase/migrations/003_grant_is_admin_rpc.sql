-- Allow authenticated users to call is_admin() for login verification
-- Run this in Supabase SQL Editor

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
