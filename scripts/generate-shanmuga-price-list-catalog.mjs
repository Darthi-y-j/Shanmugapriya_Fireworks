import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  PRICE_LIST_SECTIONS,
  SHANMUGA_BRAND_NAME,
} from '../data/shanmuga-price-list-source.mjs'
import { buildProductCopy } from '../data/shanmuga-product-copy.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outTsPath = path.join(root, 'src', 'data', 'catalog.ts')
const outJsonPath = path.join(root, 'data', 'catalog.json')

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function sellUnitFromPer(per) {
  const lower = per.toLowerCase()
  if (lower.includes('box')) return 'box'
  if (lower.includes('bag')) return 'bag'
  if (lower.includes('pkt') || lower.includes('pack')) return 'pack'
  return 'pack'
}

/** Flat shop discount — sale price is half of the price-list “before” column. */
const SHOP_DISCOUNT_PERCENT = 50

function salePriceFromBefore(before) {
  if (!before || before <= 0) return null
  return Math.round(before * (1 - SHOP_DISCOUNT_PERCENT / 100))
}

const slugByCategory = new Map()
const categories = PRICE_LIST_SECTIONS.map((section, index) => {
  const slug = slugify(section.name)
  slugByCategory.set(section.name, slug)
  return {
    name: section.name,
    slug,
    description: `${section.name} — Shanmuga's price list`,
    sort_order: index + 1,
  }
})

const usedSlugs = new Set()
const products = []

for (const section of PRICE_LIST_SECTIONS) {
  const category_slug = slugByCategory.get(section.name)
  for (const item of section.items) {
    const baseSlug = slugify(item.name)
    let slug = `s${item.sno}-${baseSlug}`
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${item.sno}`
    }
    usedSlugs.add(slug)

    const { description, specifications: copySpecs } = buildProductCopy(item, section.name)

    products.push({
      name: item.name,
      slug,
      category_slug,
      product_code: String(item.sno),
      description,
      specifications: {
        code: String(item.sno),
        sell_unit: sellUnitFromPer(item.per),
        per: item.per,
        ...copySpecs,
      },
      price: salePriceFromBefore(item.before),
      original_price: item.before,
      discount_percentage: SHOP_DISCOUNT_PERCENT,
      pieces: null,
      stock_quantity: 100,
      stock_alert_limit: 5,
      brand: SHANMUGA_BRAND_NAME,
      tag: null,
      is_featured: false,
      is_recommended: false,
      is_best_seller: false,
      is_available: true,
      sort_order: item.sno,
    })
  }
}

products.sort((a, b) => a.sort_order - b.sort_order)

const ts = `export interface CatalogCategory {
  name: string
  slug: string
  description: string
  sort_order: number
}

export interface CatalogProduct {
  name: string
  slug: string
  category_slug: string
  product_code: string
  description: string
  specifications: Record<string, string>
  price: number
  original_price: number | null
  discount_percentage: number | null
  pieces: number | null
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

export const CATALOG_CATEGORIES: CatalogCategory[] = ${JSON.stringify(categories, null, 2)}

export const CATALOG_PRODUCTS: CatalogProduct[] = ${JSON.stringify(products, null, 2)}
`

fs.writeFileSync(outTsPath, ts)
fs.writeFileSync(outJsonPath, JSON.stringify({ categories, products }, null, 2))
console.log(
  `Wrote ${categories.length} categories and ${products.length} products (brand: ${SHANMUGA_BRAND_NAME})`,
)
