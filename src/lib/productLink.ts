import type { Product } from '@/types/database'
import { getImageUrl } from '@/lib/utils'

export type ProductLinkState = {
  product: Product
}

const preloadedImages = new Set<string>()

export function preloadProductImage(url: string | null | undefined) {
  const src = getImageUrl(url)
  if (!src || preloadedImages.has(src)) return
  preloadedImages.add(src)
  const img = new Image()
  img.src = src
}

export function productDetailPath(slug: string) {
  return `/products/${slug}`
}

export function productLinkProps(product: Product) {
  return {
    to: productDetailPath(product.slug),
    state: { product } satisfies ProductLinkState,
    onTouchStart: () => preloadProductImage(product.image_url),
    onMouseEnter: () => preloadProductImage(product.image_url),
  }
}

export function readProductLinkState(state: unknown): Product | null {
  if (!state || typeof state !== 'object') return null
  const product = (state as ProductLinkState).product
  if (!product?.slug || !product?.id) return null
  return product
}
