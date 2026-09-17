import { buildCanonicalUrl } from '@/lib/seo'
import {
  BRAND_SOCIAL_PROFILES,
  DEFAULT_OG_IMAGE,
  SITE_LOGO_FILE,
  SITE_NAME,
  SITE_URL,
} from '@/lib/siteConfig'
import { resolveProductPrice } from '@/lib/pricing'
import { getImageUrl } from '@/lib/utils'
import type { Product, WebsiteSettings } from '@/types/database'

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function absoluteUrl(path: string): string {
  return buildCanonicalUrl(path, path)
}

function absoluteImageUrl(url: string | null | undefined): string | undefined {
  if (!url?.trim()) return undefined
  const resolved = getImageUrl(url)
  if (resolved.startsWith('http')) return resolved
  return `${SITE_URL}${resolved.startsWith('/') ? resolved : `/${resolved}`}`
}

function buildBrandLogoImage(settings: WebsiteSettings) {
  const logoUrl = absoluteImageUrl(settings.logo_url) ?? `${SITE_URL}${SITE_LOGO_FILE}`

  return {
    '@type': 'ImageObject',
    '@id': `${ORGANIZATION_ID}/logo`,
    url: logoUrl,
    contentUrl: logoUrl,
    width: 512,
    height: 512,
    caption: SITE_NAME,
  }
}

export function buildOrganizationSchema(settings: WebsiteSettings) {
  const logo = buildBrandLogoImage(settings)

  return {
    '@type': ['Organization', 'Store'],
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: `${SITE_URL}/`,
    logo,
    image: [logo, DEFAULT_OG_IMAGE],
    description: settings.about_text || settings.tagline || undefined,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sivakasi',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    sameAs: [...BRAND_SOCIAL_PROFILES],
  }
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: 'Shanmuga Priya Crackers Official Website',
    url: `${SITE_URL}/`,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildProductSchema(product: Product, slug: string) {
  const price = resolveProductPrice(product)
  const image = absoluteImageUrl(product.image_url)
  const productUrl = absoluteUrl(`/products/${slug}`)

  const schema: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — premium fireworks from ${SITE_NAME}.`,
    url: productUrl,
    sku: product.id,
    image: image ? [image] : undefined,
    brand: product.brand?.trim()
      ? { '@type': 'Brand', name: product.brand.trim() }
      : { '@type': 'Brand', name: SITE_NAME },
    category: product.category?.name,
  }

  if (price != null) {
    schema.offers = {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: price.toFixed(2),
      availability: product.is_available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@id': ORGANIZATION_ID },
    }
  }

  return schema
}

export function buildHomePageSchema(settings: WebsiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationSchema(settings), buildWebSiteSchema()],
  }
}

export function buildProductPageSchema(product: Product, slug: string) {
  const breadcrumbs: { name: string; path: string }[] = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ]

  if (product.category?.name) {
    breadcrumbs.push({
      name: product.category.name,
      path: `/products?category=${product.category_id}`,
    })
  }

  breadcrumbs.push({ name: product.name, path: `/products/${slug}` })

  return {
    '@context': 'https://schema.org',
    '@graph': [buildProductSchema(product, slug), buildBreadcrumbSchema(breadcrumbs)],
  }
}

export function buildBreadcrumbPageSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    ...buildBreadcrumbSchema(items),
  }
}
