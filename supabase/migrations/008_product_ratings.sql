-- Product ratings from customers (one rating per phone per product)

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

CREATE INDEX IF NOT EXISTS idx_product_ratings_product ON product_ratings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ratings_created ON product_ratings(created_at DESC);

CREATE TRIGGER update_product_ratings_updated_at BEFORE UPDATE ON product_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aggregated stats per product
CREATE OR REPLACE VIEW product_rating_stats AS
SELECT
  product_id,
  ROUND(AVG(rating)::numeric, 1) AS average_rating,
  COUNT(*)::integer AS review_count
FROM product_ratings
GROUP BY product_id;

GRANT SELECT ON product_rating_stats TO anon, authenticated;

ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product ratings" ON product_ratings
  FOR SELECT USING (true);

CREATE POLICY "Public can submit product ratings" ON product_ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update own product rating" ON product_ratings
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access product ratings" ON product_ratings
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

GRANT SELECT, INSERT, UPDATE ON product_ratings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_ratings TO authenticated;
