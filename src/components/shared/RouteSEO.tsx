import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { buildCanonicalUrl } from '@/lib/seo'

interface RouteSEOProps {
  /** Optional path override when it differs from the route pathname. */
  url?: string
}

/**
 * Sets the canonical link as soon as the customer layout mounts — before lazy page
 * chunks load — so crawlers and react-helmet-async (React 19) always see it.
 */
export function RouteSEO({ url }: RouteSEOProps) {
  const { pathname } = useLocation()
  const canonical = buildCanonicalUrl(pathname, url)

  return (
    <Helmet prioritizeSeoTags>
      <link rel="canonical" href={canonical} />
    </Helmet>
  )
}
