-- Add brand name to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS brand TEXT;

COMMENT ON COLUMN products.brand IS 'Product brand or manufacturer name';
