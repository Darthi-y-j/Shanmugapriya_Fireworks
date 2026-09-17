import type { Product } from '@/types/database'

export type ProductSortOption = 'sort_order' | 'name' | 'price_asc' | 'price_desc' | 'newest'

export const PRODUCT_SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'sort_order', label: 'Default order' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest first' },
]

export function sortProducts(products: Product[], sortBy: ProductSortOption): Product[] {
  const list = [...products]

  switch (sortBy) {
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    case 'price_asc':
      return list.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER))
    case 'price_desc':
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    case 'newest':
      return list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    case 'sort_order':
    default:
      return list.sort((a, b) => a.sort_order - b.sort_order)
  }
}
