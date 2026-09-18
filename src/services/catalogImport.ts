import { getSupabaseClient, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '@/data/catalog'
import { createCategory, deleteCategory, getCategories, updateCategory } from '@/services/categories'
import { deleteProduct, getAllProducts } from '@/services/products'

async function db() {
  return getSupabaseClient()
}

const CATALOG_MARKER_SLUG = '2-3-4-kuruvai'
const PRODUCT_CHUNK = 40

export interface CatalogImportResult {
  skipped: boolean
  categoryCount: number
  productCount: number
  removedProducts: number
  removedCategories: number
  error: string | null
}

async function catalogAlreadyImported(): Promise<boolean> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('slug', CATALOG_MARKER_SLUG)
    .maybeSingle()

  if (error) return false
  return Boolean(data?.id)
}

async function ensureCategories(): Promise<Map<string, string>> {
  const existing = await getCategories(false, 'all')
  const bySlug = new Map(existing.map((category) => [category.slug, category]))
  const byName = new Map(existing.map((category) => [category.name.trim().toLowerCase(), category]))

  await Promise.all(
    CATALOG_CATEGORIES.map(async (category) => {
      const match =
        bySlug.get(category.slug) ?? byName.get(category.name.trim().toLowerCase())
      const payload = {
        name: category.name,
        slug: category.slug,
        description: category.description,
        is_active: true,
        is_archived: false,
        archived_at: null as string | null,
      }

      if (match) {
        const { error } = await updateCategory(match.id, payload)
        if (error) throw new Error(error)
        return
      }

      const { error } = await createCategory({
        ...payload,
        image_url: null,
        sort_order: category.sort_order,
      })
      if (error) throw new Error(error)
    }),
  )

  const saved = await getCategories(false, 'all')
  const idBySlug = new Map<string, string>()
  for (const category of CATALOG_CATEGORIES) {
    const match =
      saved.find((item) => item.slug === category.slug) ??
      saved.find((item) => item.name.trim().toLowerCase() === category.name.trim().toLowerCase())
    if (!match) throw new Error(`Category "${category.name}" was not created`)
    idBySlug.set(category.slug, match.id)
  }
  return idBySlug
}

async function upsertProducts(categoryIds: Map<string, string>) {
  const supabase = await db()
  const rows = CATALOG_PRODUCTS.map((product) => {
    const category_id = categoryIds.get(product.category_slug)
    if (!category_id) {
      throw new Error(`Missing category for ${product.name} (${product.category_slug})`)
    }
    return {
      name: product.name,
      slug: product.slug,
      category_id,
      description: product.description,
      specifications: product.specifications,
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
    if (!error) continue

    if (isMissingColumnError(error, 'is_archived') || isMissingColumnError(error, 'stock_quantity')) {
      const fallback = chunk.map((row) => {
        const {
          is_archived: _archived,
          archived_at: _archivedAt,
          stock_quantity: _stock,
          stock_alert_limit: _alert,
          is_recommended: _recommended,
          is_best_seller: _bestSeller,
          original_price: _original,
          discount_percentage: _discount,
          ...rest
        } = row
        return rest
      })
      const retry = await supabase.from('products').upsert(fallback, { onConflict: 'slug' })
      if (retry.error) throw new Error(getSupabaseErrorMessage(retry.error))
      continue
    }

    throw new Error(getSupabaseErrorMessage(error))
  }
}

/** Permanently delete every product and category before a full catalogue replace. */
async function removeAllCatalogItems(): Promise<{ removedProducts: number; removedCategories: number }> {
  let removedProducts = 0
  let removedCategories = 0

  const products = await getAllProducts({ archived: 'all' })
  for (const product of products) {
    const { error } = await deleteProduct(product.id)
    if (error) throw new Error(`Could not delete product "${product.name}": ${error}`)
    removedProducts += 1
  }

  const categories = await getCategories(false, 'all')
  for (const category of categories) {
    const { error } = await deleteCategory(category.id)
    if (error) throw new Error(`Could not delete category "${category.name}": ${error}`)
    removedCategories += 1
  }

  return { removedProducts, removedCategories }
}

/** Permanently delete every product and category. */
export async function clearAllCatalog(): Promise<{
  removedProducts: number
  removedCategories: number
  error: string | null
}> {
  try {
    const removed = await removeAllCatalogItems()
    return { ...removed, error: null }
  } catch (error) {
    return {
      removedProducts: 0,
      removedCategories: 0,
      error: getSupabaseErrorMessage(error),
    }
  }
}

export async function importCatalog(
  options: { force?: boolean; replace?: boolean } = {},
): Promise<CatalogImportResult> {
  try {
    if (!options.force && !options.replace && (await catalogAlreadyImported())) {
      return {
        skipped: true,
        categoryCount: CATALOG_CATEGORIES.length,
        productCount: CATALOG_PRODUCTS.length,
        removedProducts: 0,
        removedCategories: 0,
        error: null,
      }
    }

    let removedProducts = 0
    let removedCategories = 0
    if (options.replace) {
      const removed = await removeAllCatalogItems()
      removedProducts = removed.removedProducts
      removedCategories = removed.removedCategories
    }

    const categoryIds = await ensureCategories()
    await upsertProducts(categoryIds)

    return {
      skipped: false,
      categoryCount: CATALOG_CATEGORIES.length,
      productCount: CATALOG_PRODUCTS.length,
      removedProducts,
      removedCategories,
      error: null,
    }
  } catch (error) {
    return {
      skipped: false,
      categoryCount: 0,
      productCount: 0,
      removedProducts: 0,
      removedCategories: 0,
      error: getSupabaseErrorMessage(error),
    }
  }
}
