-- Primary contact: +91 88254 11254 (replaces 9344335242)
UPDATE website_settings
SET
  phone = '+91 88254 11254',
  whatsapp_number = '918825411254',
  social_links = jsonb_set(
    COALESCE(social_links, '{}'::jsonb),
    '{whatsapp_numbers}',
    '["918825411254", "918825988269", "919789514191"]'::jsonb
  ),
  updated_at = NOW();
