-- Aura Crackers official social media links
UPDATE website_settings
SET
  social_links = COALESCE(social_links, '{}'::jsonb) || '{
    "youtube": "https://www.youtube.com/@AuraCrackers",
    "facebook": "https://www.facebook.com/share/192L4T2prh/?mibextid=wwXIfr",
    "instagram": "https://www.instagram.com/aura_crackers?igsi=MTA0aHFzM3VwOHRpOA%3D%3D&utm_source=qr"
  }'::jsonb,
  updated_at = NOW();
