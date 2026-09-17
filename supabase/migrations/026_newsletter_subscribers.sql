-- Newsletter email subscribers (footer + homepage forms)

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'footer' CHECK (source IN ('footer', 'home')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at
  ON newsletter_subscribers (subscribed_at DESC);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read newsletter subscribers" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "Admins delete newsletter subscribers" ON newsletter_subscribers
  FOR DELETE TO authenticated
  USING (is_admin());

CREATE OR REPLACE FUNCTION subscribe_newsletter(
  p_email TEXT,
  p_source TEXT DEFAULT 'footer'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
  v_source TEXT;
BEGIN
  v_email := lower(trim(p_email));
  v_source := COALESCE(NULLIF(lower(trim(p_source)), ''), 'footer');

  IF v_email IS NULL OR v_email = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  IF v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  IF v_source NOT IN ('footer', 'home') THEN
    v_source := 'footer';
  END IF;

  INSERT INTO newsletter_subscribers (email, source)
  VALUES (v_email, v_source)
  ON CONFLICT (email) DO UPDATE SET
    source = EXCLUDED.source,
    subscribed_at = NOW();

  RETURN jsonb_build_object('ok', true, 'email', v_email);
END;
$$;

GRANT EXECUTE ON FUNCTION subscribe_newsletter(TEXT, TEXT) TO anon, authenticated;
