-- Replace leftover Prime Crackers / Aura branding with Shanmugapriya Fire Works.

UPDATE website_settings
SET
  business_name = 'Shanmugapriya Fire Works',
  tagline = COALESCE(NULLIF(trim(tagline), ''), 'We Create Your Happiness'),
  email = CASE
    WHEN email ILIKE '%primecracker%' OR email ILIKE '%aura%' THEN 'shanmugapriyafireworks2021@gmail.com'
    ELSE email
  END,
  about_text = CASE
    WHEN about_text ILIKE '%prime cracker%'
      OR about_text ILIKE '%aura%'
      OR COALESCE(about_text, '') = '' THEN
      'Shanmugapriya Fire Works brings festivals to life with quality crackers from Sivakasi. Wholesale and retail fireworks with all-India delivery from Virudhunagar.'
    ELSE about_text
  END,
  updated_at = now()
WHERE business_name ILIKE '%prime cracker%'
   OR business_name ILIKE '%aura%'
   OR email ILIKE '%primecracker%'
   OR email ILIKE '%aura%'
   OR COALESCE(about_text, '') ILIKE '%prime cracker%'
   OR COALESCE(about_text, '') ILIKE '%aura%';

UPDATE products
SET brand = 'Shanmugapriya Fire Works'
WHERE brand ILIKE '%prime cracker%'
   OR brand ILIKE '%aura%';
