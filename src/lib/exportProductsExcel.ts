import * as XLSX from 'xlsx'
import type { Category, Product } from '@/types/database'
import { resolveProductPrice } from '@/lib/pricing'
import { getProductTagLabel } from '@/lib/productTags'

export function downloadProductsExcel(products: Product[], categories: Category[]): void {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]))

  const rows = products.map((product) => ({
    Category: product.category_id ? categoryMap.get(product.category_id) || '—' : '—',
    'Product Name': product.name,
    Slug: product.slug,
    Brand: product.brand || '',
    Tag: product.tag ? getProductTagLabel(product.tag) : '',
    Price: resolveProductPrice(product) ?? '',
    'Original Price': product.original_price ?? '',
    'Discount %': product.discount_percentage ?? '',
    Pieces: product.pieces ?? '',
    Stock: product.stock_quantity ?? '',
    'Stock Alert': product.stock_alert_limit ?? '',
    Status: product.is_available ? 'Available' : 'Unavailable',
    Recommended: product.is_recommended ? 'Yes' : 'No',
    'Best Seller': product.is_best_seller ? 'Yes' : 'No',
    'Sort Order': product.sort_order,
    'Image URL': product.image_url || '',
    Description: product.description || '',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [
    { wch: 18 },
    { wch: 32 },
    { wch: 24 },
    { wch: 16 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 8 },
    { wch: 8 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 36 },
    { wch: 40 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(workbook, `shanmuga-products-${date}.xlsx`)
}
