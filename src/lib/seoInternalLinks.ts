import { SITE_URL } from '@/lib/siteConfig'

export type SeoNavLink = {
  href: string
  label: string
}

/** One link per URL — SEO tools often count unique internal destinations only. */
export const HOME_SEO_NAV_LINKS: SeoNavLink[] = [
  { href: `${SITE_URL}/`, label: 'Home' },
  { href: `${SITE_URL}/products`, label: 'Shop all fireworks' },
  { href: `${SITE_URL}/about`, label: 'About Shanmuga Priya' },
  { href: `${SITE_URL}/contact`, label: 'Contact & location' },
  { href: `${SITE_URL}/delivery`, label: 'Delivery information' },
  { href: `${SITE_URL}/safety`, label: 'Safety guide' },
  { href: `${SITE_URL}/faq`, label: 'FAQ' },
  { href: `${SITE_URL}/why-no-online-payment`, label: 'Why no online payment' },
  { href: `${SITE_URL}/cart`, label: 'Shopping cart' },
  { href: `${SITE_URL}/wishlist`, label: 'Saved favourites' },
  { href: `${SITE_URL}/login`, label: 'Customer login' },
  { href: `${SITE_URL}/register`, label: 'Create account' },
  { href: `${SITE_URL}/privacy`, label: 'Privacy policy' },
  { href: `${SITE_URL}/terms`, label: 'Terms of service' },
]

export function absoluteInternalPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
