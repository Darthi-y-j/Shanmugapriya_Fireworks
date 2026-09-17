-- Add items JSONB column for multi-product cart enquiries
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';
