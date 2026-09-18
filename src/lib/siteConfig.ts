/** Canonical production site URL — used for SEO meta tags, sitemap, and auth email redirects. */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://www.shanmugapriyacrackers.com'

export const SITE_NAME = 'Shanmugapriya Fire Works'

/** Freelance / agency credit shown in the site footer. */
export const DEVELOPER_CREDIT = {
  label: 'Website designed & developed by',
  name: 'IHTRAD TECHNOLOGIES',
  url: 'https://www.ihtrad.com',
} as const

export const DEFAULT_DESCRIPTION =
  'Shanmuga Priya Crackers — Your Festival, Our Passion. Buy Diwali crackers wholesale & retail from Sivakasi. Fancy items, rockets, sparklers & more. All-India delivery.'

/** Homepage document title — ~50 chars, aligned with on-page H1 keywords. */
export const HOME_PAGE_TITLE = 'Sivakasi Diwali Fireworks Wholesale | Shanmuga Priya Crackers'

/** OG / WhatsApp share image (public/og-share.png) — 1200×630. */
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/** Homepage meta description — natural brand + product intent without keyword stuffing. */
export const HOME_PAGE_DESCRIPTION =
  'Shanmuga Priya Crackers — Your Festival, Our Passion. Buy Diwali crackers from Sivakasi. Wholesale & retail fireworks with all-India delivery. Enquire on WhatsApp.'

/** Bump when favicon assets change — busts aggressive browser favicon cache. */
export const FAVICON_VERSION = '2'

/** Brand logo for schema / PDF / admin (full resolution). */
export const SITE_LOGO_FILE = '/shanmuga-priya-logo.png'
export const SITE_LOGO_PATH = `${SITE_LOGO_FILE}?v=${FAVICON_VERSION}`

/** Small logo for navbar, footer, and auth cards — avoids loading a 1440px PNG. */
export const SITE_UI_LOGO_PATH = `/images/ui/site-logo-sm.webp?v=4`

/** Products catalogue page hero background */
export const PRODUCTS_PAGE_BG_PATH = '/images/products-page-bg.webp?v=4'

/** FAQ page hero background */
export const FAQ_PAGE_HERO_BG = '/images/faq/faq-hero-bg.webp?v=4'

/** FAQ accordion section backgrounds */
export const FAQ_PAGE_CONTENT_BG = '/images/faq/faq-content-bg.webp?v=4'
export const FAQ_PAGE_CONTENT_MOBILE_BG = '/images/faq/faq-content-mobile-bg.webp?v=4'

/** FAQ accordion item card background */
export const FAQ_ITEM_BG = '/images/faq/faq-item-bg.webp?v=4'

/** Site footer background */
export const FOOTER_BG = '/images/footer-bg.webp?v=4'

/** Cart & liked products page hero background */
export const CART_LIKES_PAGE_HERO_BG = '/images/cart/cart-likes-hero-bg.webp?v=4'

/** Privacy policy & terms page hero background */
export const LEGAL_PAGE_HERO_BG = '/images/legal/legal-hero-bg.webp?v=4'

/** Contact page hero background */
export const CONTACT_PAGE_HERO_BG = '/images/contact/contact-hero-bg.webp?v=4'
export const CONTACT_PAGE_HERO_MOBILE_BG = '/images/contact/contact-hero-mobile-bg.webp?v=4'

/** Contact page — left "Connect With Us" panel */
export const CONTACT_CONNECT_BG = '/images/contact/contact-connect-bg.webp?v=4'
export const CONTACT_CONNECT_MOBILE_BG = '/images/contact/contact-connect-mobile-bg.webp?v=4'

/** Contact page — area outside the contact card (desktop) */
export const CONTACT_PAGE_CONTENT_BG = '/images/contact/contact-content-bg.webp?v=4'

/** Contact page — area outside the contact card (mobile) */
export const CONTACT_PAGE_CONTENT_MOBILE_BG = '/images/contact/contact-content-mobile-bg.webp?v=4'

/** Contact page — card inner fill (mobile / tablet, inside frame) */
export const CONTACT_CARD_INNER_BG = '/images/contact/contact-card-inner-bg.webp?v=4'

/** Brand wordmark — same circular logo */
export const SITE_WORDMARK_FILE = '/shanmuga-priya-logo.png'
export const SITE_WORDMARK_PATH = `${SITE_WORDMARK_FILE}?v=${FAVICON_VERSION}`

/** Trimmed favicons generated from SITE_LOGO_FILE — use for browser tab / PWA. */
export const FAVICON_PATH = `/favicon.png?v=${FAVICON_VERSION}`
export const FAVICON_32_PATH = `/favicon-32x32.png?v=${FAVICON_VERSION}`
export const FAVICON_192_PATH = `/favicon-192x192.png?v=${FAVICON_VERSION}`
export const APPLE_TOUCH_ICON_PATH = `/apple-touch-icon.png?v=${FAVICON_VERSION}`
/** Cache-bust so WhatsApp/Facebook refetch after the share image changes. */
export const OG_IMAGE_PATH = '/og-share.png?v=2'
export const FAVICON_ICO_PATH = `/favicon.ico?v=${FAVICON_VERSION}`
export const FAVICON_URL = `${SITE_URL}${FAVICON_PATH.split('?')[0]}`
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`

/** Public social profiles for Organization schema (sameAs) — add URLs when client provides them. */
export const BRAND_SOCIAL_PROFILES: readonly string[] = [
  'https://www.youtube.com/channel/UCoTElmkU6uwyUs8Xm9ArFkw',
]

/** Static public routes included in the sitemap (no auth/admin/user-only pages). */
export const SITEMAP_STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/delivery', changefreq: 'monthly', priority: '0.7' },
  { path: '/why-no-online-payment', changefreq: 'monthly', priority: '0.6' },
  { path: '/safety', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
] as const
