-- Run in Supabase → SQL Editor to permanently delete every product and category.
-- Enquiry records are kept; product_id is set to NULL when a product is removed.

DELETE FROM products;
DELETE FROM categories;
