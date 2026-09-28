import type { CartItem, Product } from '@/types/database'
import { getPriceListPerLabel } from '@/lib/packaging'

export function buildCartItemFromProduct(
  product: Product,
  quantity: number,
  price: number | null,
): CartItem {
  return {
    productId: product.id,
    productName: product.name,
    slug: product.slug,
    imageUrl: product.image_url,
    price,
    pieces: product.pieces ?? null,
    per: getPriceListPerLabel(product.specifications),
    description: product.description,
    quantity,
  }
}
