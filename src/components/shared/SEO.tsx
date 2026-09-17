import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { buildCanonicalUrl } from '@/lib/seo'
import {
  APPLE_TOUCH_ICON_PATH,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  FAVICON_192_PATH,
  FAVICON_32_PATH,
  FAVICON_ICO_PATH,
  FAVICON_PATH,
  SITE_NAME,
  SITE_URL,
} from '@/lib/siteConfig'

interface SEOProps {
  title: string
  description?: string
  image?: string
  /** Pathname (e.g. `/about`) or full URL. Defaults to current route pathname. */
  url?: string
  type?: string
  /** When true, adds noindex/nofollow — use for login, account, cart, etc. */
  noIndex?: boolean
  /** Use title exactly as provided (for homepage brand title). */
  titleIsFull?: boolean
}

function resolveCanonical(url: string | undefined, pathname: string): string {
  return buildCanonicalUrl(pathname, url)
}

function resolveOgImage(image: string | undefined): string {
  if (!image) return DEFAULT_OG_IMAGE
  if (image.startsWith('http')) return image
  return `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = 'website',
  noIndex = false,
  titleIsFull = false,
}: SEOProps) {
  const { pathname } = useLocation()
  const fullTitle = titleIsFull || title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const canonical = resolveCanonical(url, pathname)
  const ogImage = resolveOgImage(image)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow'
  const googleVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="theme-color" content="#0F2847" />
      {googleVerification ? (
        <meta name="google-site-verification" content={googleVerification} />
      ) : null}
      <link rel="canonical" href={canonical} />
      <link rel="icon" href={FAVICON_ICO_PATH} sizes="any" />
      <link rel="icon" href={FAVICON_32_PATH} type="image/png" sizes="32x32" />
      <link rel="icon" href={FAVICON_192_PATH} type="image/png" sizes="192x192" />
      <link rel="shortcut icon" href={FAVICON_PATH} type="image/png" />
      <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON_PATH} />
      <link rel="manifest" href="/site.webmanifest" />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${SITE_NAME} — premium fireworks and crackers`} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} — premium fireworks and crackers`} />
    </Helmet>
  )
}
