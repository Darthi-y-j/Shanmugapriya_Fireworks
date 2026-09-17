/**
 * Replace the live Supabase catalogue with data from data/catalog.json
 *
 * Auth (pick one):
 *   SUPABASE_SERVICE_ROLE_KEY — from Supabase Dashboard → Settings → API
 *   ADMIN_EMAIL + ADMIN_PASSWORD — admin login
 *
 * Usage: npm run import:catalog
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function loadEnvFile() {
  const envPath = path.join(root, '.env')
  if (!fs.existsSync(envPath)) return {}
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

function getErrorMessage(error) {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error.message === 'string') return error.message
  return JSON.stringify(error)
}

const env = { ...loadEnvFile(), ...process.env }
const supabaseUrl = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = env.ADMIN_EMAIL
const adminPassword = env.ADMIN_PASSWORD

if (!supabaseUrl || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const catalogPath = path.join(root, 'data', 'catalog.json')
if (!fs.existsSync(catalogPath)) {
  console.error(`Missing ${catalogPath}. Run: npm run catalog`)
  process.exit(1)
}

const { categories, products } = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
const key = serviceRoleKey || anonKey
const supabase = createClient(supabaseUrl, key)

const PRODUCT_CHUNK = 40

async function ensureAdminSession() {
  if (serviceRoleKey) return
  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Set SUPABASE_SERVICE_ROLE_KEY or ADMIN_EMAIL + ADMIN_PASSWORD in .env, or use Admin → Products → Import catalogue in the browser.',
    )
  }
  const { error } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  if (error) throw error
}

async function removeAll() {
  const { data: existingProducts, error: productsError } = await supabase
    .from('products')
    .select('id, name')
  if (productsError) throw productsError

  for (const product of existingProducts ?? []) {
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) throw new Error(`Could not delete product "${product.name}": ${getErrorMessage(error)}`)
  }

  const { data: existingCategories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')
  if (categoriesError) throw categoriesError

  for (const category of existingCategories ?? []) {
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    if (error) throw new Error(`Could not delete category "${category.name}": ${getErrorMessage(error)}`)
  }

  return {
    removedProducts: existingProducts?.length ?? 0,
    removedCategories: existingCategories?.length ?? 0,
  }
}

async function upsertCategories() {
  const idBySlug = new Map()

  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(
        {
          name: category.name,
          slug: category.slug,
          description: category.description,
          is_active: true,
          is_archived: false,
          archived_at: null,
          sort_order: category.sort_order,
        },
        { onConflict: 'slug' },
      )
      .select('id, slug')
      .single()

    if (error) throw new Error(`Category "${category.name}": ${getErrorMessage(error)}`)
    idBySlug.set(data.slug, data.id)
  }

  return idBySlug
}

async function upsertProducts(categoryIds) {
  const rows = products.map((product) => {
    const category_id = categoryIds.get(product.category_slug)
    if (!category_id) {
      throw new Error(`Missing category for ${product.name} (${product.category_slug})`)
    }
    return {
      name: product.name,
      slug: product.slug,
      category_id,
      description: product.description,
      specifications: product.specifications ?? {},
      price: product.price,
      original_price: product.original_price,
      discount_percentage: product.discount_percentage,
      pieces: product.pieces,
      stock_quantity: product.stock_quantity,
      stock_alert_limit: product.stock_alert_limit,
      brand: product.brand,
      tag: product.tag,
      is_available: product.is_available,
      is_featured: product.is_featured,
      is_recommended: product.is_recommended,
      is_best_seller: product.is_best_seller,
      is_archived: false,
      archived_at: null,
      sort_order: product.sort_order,
    }
  })

  for (let i = 0; i < rows.length; i += PRODUCT_CHUNK) {
    const chunk = rows.slice(i, i + PRODUCT_CHUNK)
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'slug' })
    if (error) throw new Error(`Products batch ${i / PRODUCT_CHUNK + 1}: ${getErrorMessage(error)}`)
  }
}

async function main() {
  console.log(`Importing ${products.length} products in ${categories.length} categories…`)
  await ensureAdminSession()

  const removed = await removeAll()
  console.log(`Removed ${removed.removedProducts} products, ${removed.removedCategories} categories`)

  const categoryIds = await upsertCategories()
  console.log(`Upserted ${categoryIds.size} categories`)

  await upsertProducts(categoryIds)
  console.log(`Imported ${products.length} products`)

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`Done. Products in database: ${count ?? 'unknown'}`)
}

main().catch((error) => {
  console.error(getErrorMessage(error))
  process.exit(1)
})
