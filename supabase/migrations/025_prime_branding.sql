-- Replace leftover Aura Crackers business details with Prime Crackers.

UPDATE website_settings
SET
  business_name = 'Prime Crackers',
  tagline = COALESCE(NULLIF(trim(tagline), ''), 'We Bring Festivals'),
  email = CASE
    WHEN email ILIKE '%aura%' THEN 'primecrackerssivakasi@gmail.com'
    ELSE email
  END,
  about_text = CASE
    WHEN about_text ILIKE '%aura%' THEN
      'Prime Crackers brings festivals to life with quality crackers from Sivakasi. We offer wholesale & retail fireworks at up to 50% off — fancy items, rockets, sparklers and more, with all-India delivery from Alamarathupatti.'
    ELSE about_text
  END,
  social_links = COALESCE(social_links, '{}'::jsonb)
    || '{"youtube":"https://www.youtube.com/@primecrackers","instagram":"https://www.instagram.com/primecrackers"}'::jsonb,
  updated_at = now()
WHERE business_name ILIKE '%aura%'
   OR email ILIKE '%aura%'
   OR COALESCE(about_text, '') ILIKE '%aura%';

UPDATE products
SET brand = 'Prime Crackers'
WHERE brand ILIKE '%aura%';
