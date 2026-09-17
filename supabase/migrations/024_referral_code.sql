-- Referral codes on enquiries + submit_enquiry RPC update.
-- Run in Supabase SQL Editor if not applied via migrations.

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS referral_code TEXT;

CREATE INDEX IF NOT EXISTS idx_enquiries_referral_code
  ON enquiries(referral_code)
  WHERE referral_code IS NOT NULL;

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
  p_auth_user_id UUID DEFAULT NULL,
  p_referral_code TEXT DEFAULT NULL
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
  v_referral TEXT := NULLIF(UPPER(TRIM(p_referral_code)), '');
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
    auth_user_id,
    referral_code
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
    v_auth,
    v_referral
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_enquiry(
  TEXT, TEXT, TEXT, TEXT, UUID, INTEGER, TEXT, JSONB, TEXT, TEXT, TEXT, UUID, TEXT
) TO anon, authenticated;
