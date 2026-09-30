import { SITE_URL } from '@/lib/siteConfig'

export type SeoNavLink = {
  href: string
  label: string
}

/** Absolute same-site URLs — reliable for SEO crawlers on the homepage. */
export const HOME_SEO_NAV_LINKS: SeoNavLink[] = [
  { href: `${SITE_URL}/products`, label: 'Shop all crackers' },
  { href: `${SITE_URL}/products`, label: 'Sivakasi fireworks catalogue' },
  { href: `${SITE_URL}/about`, label: 'About us' },
  { href: `${SITE_URL}/contact`, label: 'Contact' },
  { href: `${SITE_URL}/delivery`, label: 'Delivery' },
  { href: `${SITE_URL}/safety`, label: 'Safety guide' },
  { href: `${SITE_URL}/faq`, label: 'FAQ' },
  { href: `${SITE_URL}/cart`, label: 'Cart' },
  { href: `${SITE_URL}/account`, label: 'My account' },
  { href: `${SITE_URL}/privacy`, label: 'Privacy' },
  { href: `${SITE_URL}/terms`, label: 'Terms' },
  { href: `${SITE_URL}/contact`, label: 'Store location' },
]

export function absoluteInternalPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}
