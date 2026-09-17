import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const xlsxPath = path.join(root, 'data', 'Aura_Crackers_Product_Entry_Table.xlsx')
const outPath = path.join(root, 'src', 'data', 'catalog.ts')

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function yesNo(value) {
  return String(value).trim().toLowerCase() === 'yes'
}

function num(value) {
  if (value === '' || value == null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function cleanBrand(value) {
  const brand = String(value || '').trim()
  if (!brand || brand.toLowerCase() === 'aura' || brand.toLowerCase() === 'aura crackers') {
    return 'Shanmuga Priya Crackers'
  }
  return brand
}

function cleanDescription(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function cleanTag(value) {
  const tag = String(value || '').trim()
  return tag || null
}

if (!fs.existsSync(xlsxPath)) {
  console.error(`Missing ${xlsxPath}`)
  process.exit(1)
}

const workbook = XLSX.readFile(xlsxPath)
const sheet = workbook.Sheets['Product Data']
if (!sheet) {
  console.error('Sheet "Product Data" not found')
  process.exit(1)
}

const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
const categoryOrder = []
const categorySlugByName = new Map()

for (const row of rows) {
  const name = String(row.Category || '').trim()
  if (!name || categorySlugByName.has(name)) continue
  categorySlugByName.set(name, slugify(name))
  categoryOrder.push(name)
}

const categories = categoryOrder.map((name, index) => ({
  name,
  slug: categorySlugByName.get(name),
  description: `${name} products`,
  sort_order: index + 1,
}))

const products = rows.map((row, index) => {
  const categoryName = String(row.Category || '').trim()
  const category_slug = categorySlugByName.get(categoryName)
  if (!category_slug) {
    throw new Error(`Missing category for row ${index + 1}: ${row['Product Name *']}`)
  }

  const sellingPrice = num(row['Selling Price (₹)'])
  const mrp = num(row['MRP (₹)'])
  const discount = num(row['Discount %'])

  return {
    name: String(row['Product Name *']).trim(),
    slug: String(row['Slug *']).trim(),
    category_slug,
    description: cleanDescription(row.Description),
    specifications: {},
    price: sellingPrice ?? mrp ?? 0,
    original_price: mrp,
    discount_percentage: discount,
    pieces: num(row['Pieces (per pack)']) ?? 1,
    stock_quantity: num(row['Available Quantity']) ?? 0,
    stock_alert_limit: num(row['Alert Limit']) ?? 5,
    brand: cleanBrand(row.Brand),
    tag: cleanTag(row.Tag),
    is_featured: yesNo(row.Featured),
    is_recommended: yesNo(row.Recommended),
    is_best_seller: yesNo(row['Best Seller']),
    is_available: yesNo(row.Available),
    sort_order: index + 1,
  }
})

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

export const CATALOG_CATEGORIES: CatalogCategory[] = ${JSON.stringify(categories, null, 2)}

export const CATALOG_PRODUCTS: CatalogProduct[] = ${JSON.stringify(products, null, 2)}
`

fs.writeFileSync(outPath, ts)
fs.writeFileSync(path.join(root, 'data', 'catalog.json'), JSON.stringify({ categories, products }, null, 2))
console.log(`Wrote ${categories.length} categories and ${products.length} products to ${outPath}`)
