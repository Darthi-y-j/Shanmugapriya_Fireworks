-- =============================================================================
-- Shanmugapriya Fire Works — full database setup
-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run
-- (Fresh project with no tables yet)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_archived BOOLEAN DEFAULT false NOT NULL,
  archived_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  price NUMERIC,
  original_price NUMERIC,
  discount_percentage NUMERIC,
  pieces INTEGER,
  brand TEXT,
  tag TEXT,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  youtube_url TEXT,
  stock_quantity INTEGER,
  stock_alert_limit INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN DEFAULT false NOT NULL,
  archived_at TIMESTAMPTZ,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_message TEXT,
  customer_email TEXT,
  enquiry_category TEXT,
  enquiry_type TEXT DEFAULT 'cart'
    CHECK (enquiry_type IN ('cart', 'contact', 'account', 'order')),
  items JSONB DEFAULT '[]',
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_replied BOOLEAN DEFAULT FALSE NOT NULL,
  replied_at TIMESTAMPTZ,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT DEFAULT 'Shanmugapriya Fire Works',
  tagline TEXT DEFAULT 'We Create Your Happiness',
  logo_url TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  about_text TEXT,
  social_links JSONB DEFAULT '{}',
  business_hours JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  reviewer_name TEXT NOT NULL,
  reviewer_phone TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, reviewer_phone)
);

-- ── Triggers ─────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enquiries_updated_at ON enquiries;
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_website_settings_updated_at ON website_settings;
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_ratings_updated_at ON product_ratings;
CREATE TRIGGER update_product_ratings_updated_at BEFORE UPDATE ON product_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Default settings (Shanmugapriya Fire Works) ───────────────────────────────

INSERT INTO website_settings (
  business_name, tagline, phone, whatsapp_number, email, address, about_text,
  social_links, business_hours
)
SELECT
  'Shanmugapriya Fire Works',
  'We Create Your Happiness',
  '+91 94431 94425',
  '919443194425',
  'shanmugapriyafireworks2021@gmail.com',
  'Shanmugapriya Fire Works, Virudhunagar, Tamil Nadu, India',
  'Shanmugapriya Fire Works brings festivals to life with quality crackers from Sivakasi. Wholesale and retail fireworks with all-India delivery.',
  '{
    "facebook": "",
    "instagram": "",
    "youtube": "",
    "whatsapp_numbers": ["916369773883", "918903908929"],
    "policies": {
      "delivery_areas": "All over India",
      "payment_methods": "Pre-payment",
      "whatsapp_response": "24/7",
      "years_in_business": "10+ years",
      "happy_customers": "10000+"
    }
  }'::jsonb,
  '{
    "weekdays": "24/7 — Always Open",
    "saturday": "24/7 — Always Open",
    "sunday": "24/7 — Always Open"
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM website_settings);

-- ── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(is_archived) WHERE is_archived = true;
CREATE INDEX IF NOT EXISTS idx_products_recommended ON products(is_recommended) WHERE is_recommended = true;
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_archived ON categories(is_archived) WHERE is_archived = true;
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_enquiries_auth_user ON enquiries(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_enquiries_admin_replied ON enquiries(admin_replied) WHERE admin_replied = false;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_ratings_product ON product_ratings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ratings_created ON product_ratings(created_at DESC);

-- ── Views ──────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW product_rating_stats AS
SELECT
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS average_rating,
  COUNT(*)::integer AS review_count
FROM product_ratings
GROUP BY product_id;

-- ── Helper: is_admin() ───────────────────────────────────────────────────────

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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON product_rating_stats TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON product_ratings TO anon, authenticated;

-- Categories
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true AND is_archived = false);

DROP POLICY IF EXISTS "Admin full access categories" ON categories;
CREATE POLICY "Admin full access categories" ON categories
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Products
DROP POLICY IF EXISTS "Public can view available products" ON products;
CREATE POLICY "Public can view available products" ON products
  FOR SELECT USING ((is_available = true AND is_archived = false) OR is_admin());

DROP POLICY IF EXISTS "Admin full access products" ON products;
CREATE POLICY "Admin full access products" ON products
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Enquiries
DROP POLICY IF EXISTS "Public can create enquiries" ON enquiries;
DROP POLICY IF EXISTS "Anyone can create enquiries" ON enquiries;
CREATE POLICY "Anyone can create enquiries" ON enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (auth_user_id IS NULL OR auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own enquiries" ON enquiries;
CREATE POLICY "Users can read own enquiries" ON enquiries
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Admin full access enquiries" ON enquiries;
CREATE POLICY "Admin full access enquiries" ON enquiries
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

GRANT INSERT ON enquiries TO anon, authenticated;

-- Customers
DROP POLICY IF EXISTS "Public can create customers" ON customers;
CREATE POLICY "Public can create customers" ON customers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own customer profile" ON customers;
CREATE POLICY "Users can read own customer profile" ON customers
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "Users can insert own customer profile" ON customers;
CREATE POLICY "Users can insert own customer profile" ON customers
  FOR INSERT TO authenticated WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own customer profile" ON customers;
CREATE POLICY "Users can update own customer profile" ON customers
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Admin full access customers" ON customers;
CREATE POLICY "Admin full access customers" ON customers
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Admin users
DROP POLICY IF EXISTS "Users can read own admin record" ON admin_users;
CREATE POLICY "Users can read own admin record" ON admin_users
  FOR SELECT TO authenticated USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage admin users" ON admin_users;
CREATE POLICY "Admin can manage admin users" ON admin_users
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Website settings
DROP POLICY IF EXISTS "Public can view settings" ON website_settings;
CREATE POLICY "Public can view settings" ON website_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update settings" ON website_settings;
CREATE POLICY "Admin can update settings" ON website_settings
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Product ratings
DROP POLICY IF EXISTS "Public can view product ratings" ON product_ratings;
CREATE POLICY "Public can view product ratings" ON product_ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can submit product ratings" ON product_ratings;
CREATE POLICY "Public can submit product ratings" ON product_ratings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update own product rating" ON product_ratings;
CREATE POLICY "Public can update own product rating" ON product_ratings
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access product ratings" ON product_ratings;
CREATE POLICY "Admin full access product ratings" ON product_ratings
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ── RPC functions ────────────────────────────────────────────────────────────

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
    enquiry_number, product_id, product_name, quantity,
    customer_name, customer_phone, customer_message, items, status,
    enquiry_type, customer_email, enquiry_category, auth_user_id
  ) VALUES (
    p_enquiry_number, p_product_id, p_product_name, GREATEST(COALESCE(p_quantity, 1), 1),
    p_customer_name, p_customer_phone, p_customer_message, COALESCE(p_items, '[]'::jsonb), 'new',
    COALESCE(p_enquiry_type, 'cart'), p_customer_email, p_enquiry_category, v_auth
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_enquiry(
  TEXT, TEXT, TEXT, TEXT, UUID, INTEGER, TEXT, JSONB, TEXT, TEXT, TEXT, UUID
) TO anon, authenticated;

-- ── Storage buckets ──────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true),
  ('logos', 'logos', true),
  ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());
DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND is_admin());
DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin());

DROP POLICY IF EXISTS "Public read category images" ON storage.objects;
CREATE POLICY "Public read category images" ON storage.objects
  FOR SELECT USING (bucket_id = 'category-images');
DROP POLICY IF EXISTS "Admin upload category images" ON storage.objects;
CREATE POLICY "Admin upload category images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'category-images' AND is_admin());
DROP POLICY IF EXISTS "Admin update category images" ON storage.objects;
CREATE POLICY "Admin update category images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'category-images' AND is_admin());
DROP POLICY IF EXISTS "Admin delete category images" ON storage.objects;
CREATE POLICY "Admin delete category images" ON storage.objects
  FOR DELETE USING (bucket_id = 'category-images' AND is_admin());

DROP POLICY IF EXISTS "Public read logos" ON storage.objects;
CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');
DROP POLICY IF EXISTS "Admin upload logos" ON storage.objects;
CREATE POLICY "Admin upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND is_admin());
DROP POLICY IF EXISTS "Admin update logos" ON storage.objects;
CREATE POLICY "Admin update logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND is_admin());
DROP POLICY IF EXISTS "Admin delete logos" ON storage.objects;
CREATE POLICY "Admin delete logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos' AND is_admin());

DROP POLICY IF EXISTS "Public read product videos" ON storage.objects;
CREATE POLICY "Public read product videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-videos');
DROP POLICY IF EXISTS "Admin upload product videos" ON storage.objects;
CREATE POLICY "Admin upload product videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-videos' AND is_admin());
DROP POLICY IF EXISTS "Admin update product videos" ON storage.objects;
CREATE POLICY "Admin update product videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-videos' AND is_admin());
DROP POLICY IF EXISTS "Admin delete product videos" ON storage.objects;
CREATE POLICY "Admin delete product videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-videos' AND is_admin());

-- =============================================================================
-- AFTER running this script:
-- 1. Authentication → Users → Add user (your admin email + password)
-- 2. Copy the new user's UUID and run (replace placeholders):
--
-- INSERT INTO admin_users (auth_user_id, name, email, role)
-- VALUES ('PASTE-AUTH-USER-UUID-HERE', 'Admin', 'your@email.com', 'admin');
--
-- 3. Add products via /admin/products or npm run import:catalog
-- =============================================================================
