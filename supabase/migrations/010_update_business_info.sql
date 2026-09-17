-- Update Aura Crackers business information
UPDATE website_settings
SET
  phone = '+91 88254 11254',
  whatsapp_number = '918825411254',
  address = 'S.No:1640/2A, D.No:3/1626-A, Sivakasi-Sengamalapatti Main Road,
Keelathiruthangal Village,
Taluk: Sivakasi, District: Virudhunagar,
Tamil Nadu, India',
  email = 'auracrackers@gmail.com',
  business_hours = '{"weekdays": "24/7 — Always Open", "saturday": "24/7 — Always Open", "sunday": "24/7 — Always Open"}'::jsonb,
  social_links = COALESCE(social_links, '{}'::jsonb) || '{
    "whatsapp_numbers": ["918825411254", "918825988269", "919789514191"],
    "policies": {
      "delivery_areas": "All over India",
      "payment_methods": "Pre-payment",
      "whatsapp_response": "24/7",
      "years_in_business": "4+ years",
      "happy_customers": "5000+"
    }
  }'::jsonb,
  about_text = 'Aura Crackers is your trusted partner for premium quality fireworks and crackers, serving customers across India for over 4 years. We offer a wide variety of products for Diwali, weddings, and all festive celebrations — with 24/7 WhatsApp support and delivery nationwide.',
  updated_at = NOW();
