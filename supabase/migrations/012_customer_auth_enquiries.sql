-- Link customers to Supabase auth users
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Extend enquiries for contact / account messages
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_type TEXT DEFAULT 'cart'
  CHECK (enquiry_type IN ('cart', 'contact', 'account'));
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS enquiry_category TEXT;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_auth_user ON enquiries(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Authenticated customers can read their own enquiries
CREATE POLICY "Users can read own enquiries" ON enquiries
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

-- Customer profile access for logged-in users
CREATE POLICY "Users can read own customer profile" ON customers
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can insert own customer profile" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own customer profile" ON customers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Upsert customer lead from public forms (anon cannot UPDATE customers directly)
CREATE OR REPLACE FUNCTION upsert_customer_lead(
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

GRANT EXECUTE ON FUNCTION upsert_customer_lead(TEXT, TEXT, TEXT) TO anon, authenticated;
