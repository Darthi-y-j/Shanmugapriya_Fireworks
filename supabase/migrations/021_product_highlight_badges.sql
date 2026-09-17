-- Recommended & Best Seller badges for products (admin-controlled)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_recommended ON products(is_recommended) WHERE is_recommended = true;
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = true;
