-- Track remaining stock and low-stock alert threshold per product
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER,
  ADD COLUMN IF NOT EXISTS stock_alert_limit INTEGER;

COMMENT ON COLUMN products.stock_quantity IS 'Remaining units available to sell';
COMMENT ON COLUMN products.stock_alert_limit IS 'Alert admin when remaining stock is at or below this number';
