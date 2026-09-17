-- Aura Crackers - Initial Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
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
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website Settings (single row)
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT DEFAULT 'Aura Crackers',
  tagline TEXT DEFAULT 'Premium Fireworks & Crackers',
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

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON website_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO website_settings (business_name, tagline, phone, whatsapp_number, email, address, about_text, social_links, business_hours)
VALUES (
  'Aura Crackers',
  'Premium Fireworks & Crackers for Every Celebration',
  '+91 9876543210',
  '919876543210',
  'info@auracrackers.com',
  'Sivakasi, Tamil Nadu, India',
  'Aura Crackers is your trusted partner for premium quality fireworks and crackers. We offer a wide variety of products for Diwali, weddings, and all festive celebrations.',
  '{"facebook": "", "instagram": "", "youtube": ""}',
  '{"weekdays": "9:00 AM - 8:00 PM", "saturday": "9:00 AM - 9:00 PM", "sunday": "10:00 AM - 6:00 PM"}'
) ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Categories: public read active, admin full access
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Products: public read available, admin full access
CREATE POLICY "Public can view available products" ON products
  FOR SELECT USING (is_available = true OR is_admin());

CREATE POLICY "Admin full access products" ON products
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Enquiries: public can insert, admin full access
CREATE POLICY "Public can create enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access enquiries" ON enquiries
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Customers: public can insert (via enquiry), admin full access
CREATE POLICY "Public can create customers" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access customers" ON customers
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Admin users: only admins can read
CREATE POLICY "Users can read own admin record" ON admin_users
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Admin can view admin users" ON admin_users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admin can manage admin users" ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Website settings: public read, admin write
CREATE POLICY "Public can view settings" ON website_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin can update settings" ON website_settings
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Storage buckets (run in Supabase Dashboard > Storage or via SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('category-images', 'category-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

-- Storage policies (uncomment after creating buckets)
/*
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Public read category images" ON storage.objects
  FOR SELECT USING (bucket_id = 'category-images');

CREATE POLICY "Admin upload category images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin update category images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin delete category images" ON storage.objects
  FOR DELETE USING (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Public read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Admin upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND is_admin());

CREATE POLICY "Admin update logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos' AND is_admin());

CREATE POLICY "Admin delete logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos' AND is_admin());
*/
