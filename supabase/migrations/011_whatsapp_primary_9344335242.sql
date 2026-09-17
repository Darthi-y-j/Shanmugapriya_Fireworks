UPDATE website_settings
SET
  whatsapp_number = '919344335242',
  social_links = jsonb_set(
    COALESCE(social_links, '{}'::jsonb),
    '{whatsapp_numbers}',
    '["919344335242", "918825988269", "919789514191"]'::jsonb
  ),
  updated_at = NOW()
WHERE whatsapp_number IS NOT NULL;
