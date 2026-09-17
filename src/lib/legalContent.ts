import type { LegalSection } from '@/components/customer/LegalDocumentLayout'
import { BUSINESS_ADDRESS, BUSINESS_EMAIL } from '@/lib/businessInfo'
import { SITE_NAME } from '@/lib/siteConfig'

const EFFECTIVE_DATE = '27/08/2026'
const LAST_UPDATED = '27/08/2026'

const BUSINESS_ADDRESS_LINE = BUSINESS_ADDRESS.replace(/\n/g, ', ')
const CONTACT_PHONE = '+91 XXXXX XXXXX'
const CONTACT_EMAIL = BUSINESS_EMAIL

const CONTACT_BLOCK = [
  `${SITE_NAME}`,
  `Address: ${BUSINESS_ADDRESS_LINE}`,
  `Phone: ${CONTACT_PHONE}`,
  `Email: ${CONTACT_EMAIL}`,
].join('\n')

export const PRIVACY_POLICY_META = {
  title: 'Privacy Policy',
  seoDescription: `Read how ${SITE_NAME} collects, uses, stores and protects your personal information when you use our website.`,
  url: '/privacy',
  effectiveDate: EFFECTIVE_DATE,
  lastUpdated: LAST_UPDATED,
  intro: `Welcome to ${SITE_NAME}. We respect your privacy and are committed to protecting the personal information you provide while using our website. This Privacy Policy explains how ${SITE_NAME} ("we", "us", "our") collects, uses, stores and protects information when you visit or interact with our website.`,
  closingNote:
    'By continuing to use this website, you acknowledge that you have read and understood this Privacy Policy.',
  heroChips: ['Your Data', 'Cookies', 'Security', 'Your Rights'],
  relatedPage: { label: 'Terms & Conditions', href: '/terms' },
}

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    title: '1. Information We Collect',
    paragraphs: [
      'Depending on how you use our website, we may collect:',
    ],
    bullets: [
      'Name',
      'Mobile number',
      'Email address',
      'Delivery or enquiry address, where applicable',
      'Information submitted through contact or enquiry forms',
      'Product preferences and enquiry details',
      'Website usage information such as browser type, device information and IP address',
      'Cookies and similar technologies',
    ],
    afterBullets: [
      'We collect only information reasonably necessary for providing our services and responding to enquiries.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    paragraphs: ['We may use collected information to:'],
    bullets: [
      'Respond to customer enquiries',
      'Provide information about our products and services',
      'Communicate with customers regarding enquiries',
      'Improve our website and customer experience',
      'Maintain website security',
      'Comply with applicable laws and regulatory requirements',
      'Prevent fraud, misuse or unauthorized activity',
    ],
    afterBullets: [
      'We will not use your personal information for unrelated purposes without appropriate notice or consent where required by law.',
    ],
  },
  {
    title: '3. Sharing of Information',
    paragraphs: [
      'We do not sell or rent your personal information.',
      'Information may be shared with service providers or authorities where reasonably necessary for:',
    ],
    bullets: [
      'Website hosting and technical services',
      'Customer communication',
      'Payment processing, where legally applicable',
      'Compliance with legal or regulatory requirements',
      'Protection of our rights, customers and business',
    ],
  },
  {
    title: '4. Cookies',
    paragraphs: [
      'Our website may use cookies and similar technologies to improve functionality, understand website usage and enhance the user experience.',
      'You may configure your browser to refuse or delete cookies. Some website functionality may be affected as a result.',
    ],
  },
  {
    title: '5. Data Security',
    paragraphs: [
      'We take reasonable technical and organizational measures to protect personal information from unauthorized access, misuse, alteration, disclosure or destruction.',
      'However, no internet transmission or electronic storage system can be guaranteed to be completely secure.',
    ],
  },
  {
    title: '6. Third-Party Websites',
    paragraphs: [
      'Our website may contain links to third-party websites or services.',
      `${SITE_NAME} is not responsible for the privacy practices, content or security of third-party websites. We recommend reviewing their respective privacy policies before providing personal information.`,
    ],
  },
  {
    title: "7. Children's Privacy",
    paragraphs: [
      'Our website is not intended to encourage children to purchase, handle or use fireworks.',
      'Fireworks must only be purchased, possessed, transported and used in accordance with applicable laws, licensing requirements and safety regulations.',
    ],
  },
  {
    title: '8. Your Rights',
    paragraphs: [
      'Subject to applicable law, you may contact us to request information about the personal data we hold about you or to request correction of inaccurate information.',
      'Requests may be submitted using the contact details provided below.',
    ],
  },
  {
    title: '9. Changes to This Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our business, technology or applicable laws.',
      'The updated version will be published on this page with the revised "Last Updated" date.',
    ],
  },
  {
    title: '10. Contact Us',
    paragraphs: [CONTACT_BLOCK],
  },
]

export const TERMS_META = {
  title: 'Terms & Conditions',
  seoDescription: `Read the terms and conditions for using the ${SITE_NAME} website, product enquiries, legal compliance and safety requirements.`,
  url: '/terms',
  effectiveDate: EFFECTIVE_DATE,
  lastUpdated: LAST_UPDATED,
  intro: `Welcome to the ${SITE_NAME} website. These Terms & Conditions govern your access to and use of our website. By accessing this website, you agree to these Terms & Conditions. If you do not agree with them, please discontinue use of the website.`,
  heroChips: ['Legal Compliance', 'Safety', 'Orders', 'Governing Law'],
  relatedPage: { label: 'Privacy Policy', href: '/privacy' },
}

export const TERMS_SECTIONS: LegalSection[] = [
  {
    title: '1. About the Website',
    paragraphs: [
      `${SITE_NAME} provides information about fireworks, products, services, offers, business information and related content through this website.`,
      'Product information displayed on the website is provided for informational purposes and may be subject to availability, applicable laws, licensing requirements and local restrictions.',
    ],
  },
  {
    title: '2. Legal Compliance',
    paragraphs: [
      'Fireworks are regulated products and their manufacture, possession, transportation, sale and use are subject to applicable Indian laws, rules, court directions and local authority requirements.',
      'Customers are responsible for complying with all applicable laws and safety requirements.',
      `${SITE_NAME} reserves the right to refuse or cancel any enquiry, transaction or request where the proposed activity may violate applicable law or regulatory requirements.`,
    ],
  },
  {
    title: '3. Product Information',
    paragraphs: [
      'We make reasonable efforts to ensure that product descriptions, photographs, specifications and other information displayed on the website are accurate.',
      'However:',
    ],
    bullets: [
      'Product appearance may vary from photographs.',
      'Product availability may change without prior notice.',
      'Prices and offers may change.',
      'Product specifications may be updated by manufacturers.',
      'Certain products may not be available in particular locations because of legal or regulatory restrictions.',
    ],
  },
  {
    title: '4. Orders and Enquiries',
    paragraphs: [
      'Submitting an enquiry, request or order through the website does not automatically guarantee acceptance or fulfillment.',
      'Any transaction involving regulated fireworks will be subject to applicable laws, licensing requirements, location-specific restrictions and our verification procedures.',
      `Where online sale or delivery of a particular product is prohibited or restricted, ${SITE_NAME} will not process the transaction.`,
    ],
  },
  {
    title: '5. Pricing',
    paragraphs: [
      'Prices displayed on the website, where applicable, are subject to change without prior notice.',
      'Any applicable taxes, charges or other costs will be communicated as required before completion of a lawful transaction.',
    ],
  },
  {
    title: '6. Payment',
    paragraphs: [
      'Where payments are accepted through the website, payments may be processed through authorized third-party payment service providers.',
      `${SITE_NAME} does not store sensitive payment credentials such as complete card numbers or banking passwords on its website unless specifically stated and lawfully permitted.`,
    ],
  },
  {
    title: '7. Cancellation and Refunds',
    paragraphs: [
      'Cancellation and refund eligibility will depend on the nature of the transaction and applicable law.',
      'For regulated products, cancellation, return and refund policies may be subject to product-specific legal restrictions.',
      'Any refund, where applicable, will be processed according to the applicable refund policy and payment provider procedures.',
    ],
  },
  {
    title: '8. Delivery and Transportation',
    paragraphs: [
      'Fireworks transportation and delivery are subject to applicable laws, safety requirements, licensing conditions and restrictions imposed by government authorities.',
      `${SITE_NAME} does not undertake or promise any delivery method that is prohibited by applicable law.`,
    ],
  },
  {
    title: '9. Safety',
    paragraphs: [
      'Fireworks must be handled and used responsibly and strictly according to applicable safety instructions and legal requirements.',
      'Customers must:',
    ],
    bullets: [
      'Follow the instructions printed on the product packaging.',
      'Keep fireworks away from children and unauthorized persons.',
      'Keep fireworks away from combustible materials.',
      'Use fireworks only in legally permitted areas and times.',
      'Follow applicable local noise, environmental and public-safety restrictions.',
      'Never modify, dismantle or misuse fireworks.',
    ],
  },
  {
    title: '10. Prohibited Use',
    paragraphs: ['You must not use the website to:'],
    bullets: [
      'Engage in unlawful activities',
      'Attempt to purchase prohibited products',
      'Provide false or misleading information',
      'Circumvent legal or regulatory restrictions',
      'Misuse website forms or services',
      'Attempt unauthorized access to the website or its systems',
    ],
  },
  {
    title: '11. Intellectual Property',
    paragraphs: [
      `All website content, including logos, branding, photographs, graphics, text, product descriptions, designs and other materials, belongs to ${SITE_NAME} or its respective licensors unless otherwise stated.`,
      'You may not reproduce, copy, modify, distribute or commercially exploit website content without prior written permission.',
    ],
  },
  {
    title: '12. Website Availability',
    paragraphs: [
      'We aim to keep the website available and accurate but do not guarantee that the website will always be uninterrupted, error-free or available.',
      'We may temporarily suspend or modify website features for maintenance, security or operational reasons.',
    ],
  },
  {
    title: '13. Limitation of Liability',
    paragraphs: [
      `To the maximum extent permitted by applicable law, ${SITE_NAME} will not be responsible for losses arising from:`,
    ],
    bullets: [
      'Unauthorized use of the website',
      'Temporary website unavailability',
      'Incorrect information supplied by users',
      'Events beyond our reasonable control',
      'Violation of applicable fireworks laws or safety requirements by customers',
    ],
    afterBullets: [
      'Nothing in these Terms excludes or limits any liability that cannot legally be excluded or limited.',
    ],
  },
  {
    title: '14. Third-Party Services',
    paragraphs: [
      'The website may use third-party services such as payment providers, analytics providers, hosting services or communication platforms.',
      'Their services may be governed by their own terms and privacy policies.',
    ],
  },
  {
    title: '15. Changes to These Terms',
    paragraphs: [
      `${SITE_NAME} may update these Terms & Conditions from time to time.`,
      'The updated version will be published on this page and will become effective from the date stated above.',
    ],
  },
  {
    title: '16. Governing Law',
    paragraphs: [
      'These Terms & Conditions shall be governed by the applicable laws of India.',
      'Any dispute shall be subject to the jurisdiction of the courts having appropriate jurisdiction over the business, subject to applicable consumer protection and other mandatory laws.',
    ],
  },
  {
    title: '17. Contact Information',
    paragraphs: [
      CONTACT_BLOCK,
      'For questions, complaints or legal notices, please contact us using the information above.',
    ],
  },
]
