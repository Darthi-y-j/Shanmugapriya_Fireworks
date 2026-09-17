import type { Product } from '@/types/database'

export function isLowStock(product: {
  stock_quantity?: number | null
  stock_alert_limit?: number | null
}): boolean {
  return (
    product.stock_quantity != null &&
    product.stock_alert_limit != null &&
    product.stock_quantity <= product.stock_alert_limit
  )
}

export function getEnquiryStockItems(enquiry: {
  product_id?: string | null
  quantity?: number
  items?: { product_id: string; quantity: number }[] | null
}): { productId: string; quantity: number }[] {
  if (enquiry.items && enquiry.items.length > 0) {
    return enquiry.items
      .filter((item) => item.product_id)
      .map((item) => ({ productId: item.product_id, quantity: item.quantity }))
  }

  if (enquiry.product_id) {
    return [{ productId: enquiry.product_id, quantity: enquiry.quantity || 1 }]
  }

  return []
}

export type StockAlertItem = Pick<Product, 'id' | 'name' | 'stock_quantity' | 'stock_alert_limit' | 'image_url'>
