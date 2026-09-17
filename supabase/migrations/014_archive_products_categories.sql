-- Soft-archive products and categories (hidden from storefront, restorable in admin)
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_products_archived ON products(is_archived) WHERE is_archived = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_archived ON categories(is_archived) WHERE is_archived = TRUE;
