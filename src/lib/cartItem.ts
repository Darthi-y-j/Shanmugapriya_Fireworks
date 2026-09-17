import type { CartItem, Product } from '@/types/database'

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
    description: product.description,
    quantity,
  }
}
