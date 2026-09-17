-- Complete enquiry fix: adds missing columns + permissions + submit_enquiry RPC.
-- Run this ENTIRE script in Supabase → SQL Editor → Run.
--
-- Fixes:
--   column "auth_user_id" does not exist
--   row-level security policy for table enquiries
--   permission denied for table enquiries

-- ── Step 1: Missing columns (from migrations 005 + 012) ─────────────────────

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_type TEXT DEFAULT 'cart';
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_category TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_auth_user ON enquiries(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- ── Step 2: Table grants ────────────────────────────────────────────────────

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON enquiries TO anon, authenticated;

-- ── Step 3: RLS policies ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Anyone can create enquiries" ON enquiries;

CREATE POLICY "Anyone can create enquiries" ON enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    auth_user_id IS NULL OR auth_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can read own enquiries" ON enquiries;
CREATE POLICY "Users can read own enquiries" ON enquiries
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Users can read own customer profile" ON customers;
CREATE POLICY "Users can read own customer profile" ON customers
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Users can insert own customer profile" ON customers;
CREATE POLICY "Users can insert own customer profile" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own customer profile" ON customers;
CREATE POLICY "Users can update own customer profile" ON customers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- ── Step 4: Customer lead upsert (contact form) ─────────────────────────────

CREATE OR REPLACE FUNCTION public.upsert_customer_lead(
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO customers (full_name, phone, email)
  VALUES (p_name, p_phone, p_email)
  ON CONFLICT (phone) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = COALESCE(EXCLUDED.email, customers.email),
    updated_at = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_customer_lead(TEXT, TEXT, TEXT) TO anon, authenticated;

-- ── Step 5: submit_enquiry RPC ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.submit_enquiry(
  p_enquiry_number TEXT,
  p_product_name TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_product_id UUID DEFAULT NULL,
  p_quantity INTEGER DEFAULT 1,
  p_customer_message TEXT DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::jsonb,
  p_enquiry_type TEXT DEFAULT 'cart',
  p_customer_email TEXT DEFAULT NULL,
  p_enquiry_category TEXT DEFAULT NULL,
  p_auth_user_id UUID DEFAULT NULL
)
RETURNS public.enquiries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.enquiries;
  v_uid UUID := auth.uid();
  v_auth UUID := p_auth_user_id;
BEGIN
  IF v_auth IS NOT NULL AND v_uid IS NOT NULL AND v_auth <> v_uid THEN
    RAISE EXCEPTION 'Cannot submit enquiry for another user';
  END IF;

  IF v_auth IS NULL AND v_uid IS NOT NULL THEN
    v_auth := v_uid;
  END IF;

  INSERT INTO public.enquiries (
    enquiry_number,
    product_id,
    product_name,
    quantity,
    customer_name,
    customer_phone,
    customer_message,
    items,
    status,
    enquiry_type,
    customer_email,
    enquiry_category,
    auth_user_id
  ) VALUES (
    p_enquiry_number,
    p_product_id,
    p_product_name,
    GREATEST(COALESCE(p_quantity, 1), 1),
    p_customer_name,
    p_customer_phone,
    p_customer_message,
    COALESCE(p_items, '[]'::jsonb),
    'new',
    COALESCE(p_enquiry_type, 'cart'),
    p_customer_email,
    p_enquiry_category,
    v_auth
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_enquiry(
  TEXT, TEXT, TEXT, TEXT, UUID, INTEGER, TEXT, JSONB, TEXT, TEXT, TEXT, UUID
) TO anon, authenticated;
