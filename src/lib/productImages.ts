import type { Product } from '@/types/database'

export const MAX_PRODUCT_GALLERY_IMAGES = 3

type ProductImageSource = Pick<Product, 'image_url' | 'gallery_urls'>

/** Ordered image URLs for a product (1–3), deduped and trimmed. */
export function getProductImageUrls(product: ProductImageSource): string[] {
  const fromGallery = (product.gallery_urls ?? []).map((url) => url?.trim()).filter(Boolean) as string[]
  if (fromGallery.length > 0) {
    return fromGallery.slice(0, MAX_PRODUCT_GALLERY_IMAGES)
  }
  const primary = product.image_url?.trim()
  return primary ? [primary] : []
}

export function normalizeProductGalleryUrls(urls: string[]): string[] {
  return urls.map((url) => url.trim()).filter(Boolean).slice(0, MAX_PRODUCT_GALLERY_IMAGES)
}

export function buildProductGalleryPayload(urls: string[]): {
  gallery_urls: string[]
  image_url: string | null
} {
  const gallery_urls = normalizeProductGalleryUrls(urls)
  return {
    gallery_urls,
    image_url: gallery_urls[0] ?? null,
  }
}

export function getInitialGallerySlots(product?: Product): [string, string, string] {
  const urls = getProductImageUrls(product ?? { image_url: null, gallery_urls: null })
  return [urls[0] ?? '', urls[1] ?? '', urls[2] ?? '']
}
