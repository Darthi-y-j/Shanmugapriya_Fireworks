-- Up to 3 product images (first entry is also stored in image_url for thumbnails)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';

COMMENT ON COLUMN products.gallery_urls IS 'Ordered product image URLs (max 3). First image mirrors image_url.';
