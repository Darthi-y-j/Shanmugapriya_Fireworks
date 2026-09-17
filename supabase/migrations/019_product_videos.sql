-- Product video upload URL and optional YouTube link
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_url TEXT;

COMMENT ON COLUMN products.video_url IS 'Public URL of an uploaded product demo video (Supabase storage)';
COMMENT ON COLUMN products.youtube_url IS 'YouTube watch or share URL for product demo';

-- Storage bucket for product videos (create in Supabase Dashboard if INSERT fails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-videos');

CREATE POLICY "Admin upload product videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "Admin update product videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-videos' AND is_admin());

CREATE POLICY "Admin delete product videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-videos' AND is_admin());
