-- Add pieces count per product (e.g. sparklers per pack)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS pieces INTEGER;

COMMENT ON COLUMN products.pieces IS 'Number of pieces in one unit/pack of the product';
