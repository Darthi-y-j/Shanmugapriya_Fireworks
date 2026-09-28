import type { Product } from '@/types/database'

/** Price-list S.No — stored in specifications.code or sort_order. */
export function getProductCode(
  product: Pick<Product, 'sort_order' | 'specifications'>,
): string {
  const fromSpec = product.specifications?.code?.trim()
  if (fromSpec) return fromSpec
  if (product.sort_order > 0) return String(product.sort_order)
  return '—'
}
