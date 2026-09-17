import { SITE_URL } from '@/lib/siteConfig'

/** Build absolute canonical URL for a pathname or explicit path override. */
export function buildCanonicalUrl(pathname: string, url?: string): string {
  if (url?.startsWith('http')) return url
  if (url) return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
  if (pathname === '/') return `${SITE_URL}/`
  return `${SITE_URL}${pathname}`
}
