export const PAYMENT_POLICY_PATH = '/why-no-online-payment'

export const paymentPolicyIntroParagraphs = [
  'Fireworks are subject to applicable laws, licensing requirements, and directions issued by the relevant authorities in India.',
  'Online purchase and direct payment for fireworks are not available through this website. You can browse our catalogue, add products to your cart, and send an enquiry with your required quantities.',
  'After you submit an enquiry, our team contacts you on WhatsApp or phone to confirm availability, pricing, delivery arrangements, and the requirements for your location.',
  'Payment is accepted only as pre-payment after your order is confirmed — not at checkout on the website.',
] as const

export const paymentPolicyHowItWorks = [
  'Browse our fireworks catalogue on the website.',
  'Add your required products to the enquiry cart.',
  'Submit your enquiry with your contact and delivery details.',
  'Our team confirms stock, price, and delivery on WhatsApp.',
  'Pre-payment is arranged only after confirmation, before dispatch.',
] as const

export const paymentPolicyPageSections = [
  {
    title: 'Why we do not take online payment on the website',
    paragraphs: [
      'Shanmuga Priya Crackers operates as a catalogue and enquiry platform. Fireworks sales involve location-specific rules, transport restrictions, and licensing checks that must be verified before an order is accepted.',
      'A WhatsApp enquiry lets us confirm whether products can be supplied to your area, share accurate pricing, and guide you through safe and lawful fulfilment.',
    ],
  },
  {
    title: 'How payment works instead',
    paragraphs: [
      'There is no payment gateway on this website. After your enquiry, our team shares payment details on WhatsApp once your order is confirmed.',
      'We accept pre-payment only — your order is processed after payment confirmation and applicable regulatory requirements are met.',
    ],
  },
  {
    title: 'Your safety and compliance',
    paragraphs: [
      'We supply only products permitted under applicable regulations and follow required safety, licensing, transportation, and statutory requirements.',
      'Product availability and fulfilment are subject to local restrictions and regulatory directions.',
    ],
  },
] as const
