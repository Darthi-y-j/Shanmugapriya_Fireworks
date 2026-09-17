export interface CatalogCategory {
  name: string
  slug: string
  description: string
  sort_order: number
}

export interface CatalogProduct {
  name: string
  slug: string
  category_slug: string
  description: string
  specifications: Record<string, string>
  price: number
  original_price: number | null
  discount_percentage: number | null
  pieces: number
  stock_quantity: number
  stock_alert_limit: number
  brand: string
  tag: string | null
  is_featured: boolean
  is_recommended: boolean
  is_best_seller: boolean
  is_available: boolean
  sort_order: number
}

/** Offline fallback — empty until client catalogue is imported via admin or XLSX. */
export const CATALOG_CATEGORIES: CatalogCategory[] = []

export const CATALOG_PRODUCTS: CatalogProduct[] = []
