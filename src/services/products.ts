import { getSupabaseClient, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import { supabaseRestGet } from '@/lib/supabaseRest'
import { logLandingPageApi, logLandingPageApiError } from '@/lib/landingPageApiLog'
import { CACHE_KEYS, readSessionCache, writeSessionCache } from '@/lib/sessionCache'
import { isLowStock } from '@/lib/stock'
import type { Product, ProductFilters } from '@/types/database'

async function db() {
  return getSupabaseClient()
}

const PRODUCT_CACHE_MS = 2 * 60 * 1000
const REQUEST_TIMEOUT_MS = 12_000
const productCache = new Map<string, { data: Product[]; at: number }>()
const inflight = new Map<string, Promise<Product[]>>()

/** Catalogue pages — omit specifications & media URLs to cut payload size */
const CATALOGUE_PRODUCT_SELECT =
  'id, category_id, name, slug, description, specifications, price, original_price, discount_percentage, pieces, brand, tag, image_url, stock_quantity, stock_alert_limit, is_available, is_featured, is_recommended, is_best_seller, is_archived, sort_order, created_at, category:categories(id, name, slug, sort_order, is_active, is_archived)'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Product request timed out')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function getProductCacheKey(filters: ProductFilters): string {
  return JSON.stringify(filters)
}

async function withProductCache(
  filters: ProductFilters,
  fetcher: () => Promise<Product[]>,
): Promise<Product[]> {
  const key = getProductCacheKey(filters)
  const cached = productCache.get(key)
  if (cached && Date.now() - cached.at < PRODUCT_CACHE_MS) {
    logLandingPageApi('getProducts:memory_cache_hit', {
      count: cached.data.length,
      filters,
    })
    return cached.data
  }

  logLandingPageApi('getProducts:start', { filters })
  const startedAt = performance.now()

  const pending = inflight.get(key)
  if (pending) {
    logLandingPageApi('getProducts:inflight_reuse', { filters })
    return pending
  }

  const request = withTimeout(fetcher(), REQUEST_TIMEOUT_MS)
    .then((data) => {
      productCache.set(key, { data, at: Date.now() })
      inflight.delete(key)
      logLandingPageApi('getProducts:done', {
        count: data.length,
        ms: Math.round(performance.now() - startedAt),
        filters,
      })
      return data
    })
    .catch((error) => {
      inflight.delete(key)
      logLandingPageApiError('getProducts:error', {
        ms: Math.round(performance.now() - startedAt),
        filters,
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    })

  inflight.set(key, request)
  return request
}

function applyArchivedFilter<T extends { eq: (col: string, val: boolean) => T }>(
  query: T,
  archived: ProductFilters['archived'],
  withArchiveFilter: boolean,
) {
  if (!withArchiveFilter) return query
  if (archived === 'archived') return query.eq('is_archived', true)
  if (archived !== 'all') return query.eq('is_archived', false)
  return query
}

type SupabaseListQuery = PromiseLike<{ data: unknown; error: unknown }>

async function queryProductsWithArchiveFallback(
  archived: ProductFilters['archived'],
  buildQuery: (withArchiveFilter: boolean) => SupabaseListQuery,
): Promise<Product[]> {
  const { data, error } = await buildQuery(true)
  if (!error) return (data as Product[]) || []

  if (isMissingColumnError(error, 'is_archived')) {
    if (archived === 'archived') return []
    const { data: fallbackData, error: fallbackError } = await buildQuery(false)
    if (fallbackError) throw new Error(getSupabaseErrorMessage(fallbackError))
    return (fallbackData as Product[]) || []
  }

  throw new Error(getSupabaseErrorMessage(error))
}

function buildProductsRestQuery(filters: ProductFilters, withArchiveFilter: boolean): string {
  const parts: string[] = []
  const select = filters.lite ? CATALOGUE_PRODUCT_SELECT : '*,category:categories(*)'
  parts.push(`select=${encodeURIComponent(select)}`)
  parts.push('is_available=eq.true')

  const archived = filters.archived ?? 'active'
  if (withArchiveFilter) {
    if (archived === 'archived') parts.push('is_archived=eq.true')
    else if (archived !== 'all') parts.push('is_archived=eq.false')
  }

  if (filters.categoryId) parts.push(`category_id=eq.${filters.categoryId}`)
  if (filters.featured) parts.push('is_featured=eq.true')

  if (filters.tags?.length) {
    const tagList = filters.tags.map((tag) => `"${tag.replace(/"/g, '')}"`).join(',')
    parts.push(`tag=in.(${tagList})`)
  } else if (filters.tag) {
    parts.push(`tag=eq.${encodeURIComponent(filters.tag)}`)
  }

  if (filters.search) {
    const term = encodeURIComponent(`%${filters.search.trim()}%`)
    parts.push(`or=(name.ilike.${term},description.ilike.${term})`)
  }

  if (filters.availability === 'available') {
    parts.push('is_available=eq.true')
  } else if (filters.availability === 'unavailable') {
    parts.push('is_available=eq.false')
  }

  switch (filters.sortBy) {
    case 'name':
      parts.push('order=name.asc')
      break
    case 'price_asc':
      parts.push('order=price.asc')
      break
    case 'price_desc':
      parts.push('order=price.desc')
      break
    case 'newest':
      parts.push('order=created_at.desc')
      break
    case 'sort_order':
    default:
      parts.push('order=sort_order.asc')
  }

  if (filters.limit) parts.push(`limit=${filters.limit}`)

  return parts.join('&')
}

async function fetchProductsFromRest(
  filters: ProductFilters,
  withArchiveFilter: boolean,
): Promise<Product[]> {
  const query = buildProductsRestQuery(filters, withArchiveFilter)
  return supabaseRestGet<Product[]>('products', query)
}

async function queryProductsWithArchiveFallbackRest(filters: ProductFilters): Promise<Product[]> {
  const archived = filters.archived ?? 'active'

  try {
    return await fetchProductsFromRest(filters, true)
  } catch (error) {
    if (isMissingColumnError(error, 'is_recommended') || isMissingColumnError(error, 'is_best_seller')) {
      throw new Error(
        'Product badges are not set up yet. Run migration 021_product_highlight_badges.sql in Supabase SQL Editor.',
      )
    }
    if (isMissingColumnError(error, 'is_archived')) {
      if (archived === 'archived') return []
      return fetchProductsFromRest(filters, false)
    }
    throw error
  }
}


function isCatalogueFilters(filters: ProductFilters): boolean {
  return (
    filters.lite === true &&
    filters.sortBy === 'sort_order' &&
    !filters.categoryId &&
    !filters.featured &&
    !filters.tag &&
    !filters.tags?.length &&
    !filters.search &&
    !filters.limit &&
    (filters.archived === undefined || filters.archived === 'active') &&
    (filters.availability === undefined || filters.availability === 'available')
  )
}

export function getCachedCatalogueProducts(): Product[] | null {
  return readSessionCache<Product[]>(CACHE_KEYS.catalogueProducts)
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  return withProductCache(filters, async () => {
    const data = await queryProductsWithArchiveFallbackRest(filters)
    if (isCatalogueFilters(filters) && data.length > 0) {
      writeSessionCache(CACHE_KEYS.catalogueProducts, data)
    }
    return data
  })
}

export async function getAllProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = await db()
  const archived = filters.archived ?? 'active'

  return queryProductsWithArchiveFallback(archived, (withArchiveFilter) => {
    let query = supabase.from('products').select('*, category:categories(*)')

    query = applyArchivedFilter(query, archived, withArchiveFilter)

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.tag) {
      query = query.eq('tag', filters.tag)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.availability === 'available') {
      query = query.eq('is_available', true)
    } else if (filters.availability === 'unavailable') {
      query = query.eq('is_available', false)
    }

    return query.order('sort_order', { ascending: true })
  })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await db()
  const withArchive = async (useArchiveFilter: boolean) => {
    let query = supabase.from('products').select('*, category:categories(*)').eq('slug', slug)
    if (useArchiveFilter) query = query.eq('is_archived', false)
    return query.single()
  }

  const { data, error } = await withArchive(true)
  if (!error) return data as Product

  if (isMissingColumnError(error, 'is_archived')) {
    const { data: fallback, error: fallbackError } = await withArchive(false)
    if (fallbackError) return null
    return fallback as Product
  }

  return null
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Product
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const filters: ProductFilters = { featured: true, sortBy: 'sort_order', lite: true, limit }
  return withProductCache(filters, () => queryProductsWithArchiveFallbackRest(filters))
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const supabase = await db()
  return queryProductsWithArchiveFallback('active', (withArchiveFilter) => {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('is_available', true)

    if (withArchiveFilter) query = query.eq('is_archived', false)

    return query.order('sort_order', { ascending: true })
  })
}

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'is_archived' | 'archived_at'> & {
    is_archived?: boolean
    archived_at?: string | null
  },
): Promise<{ data: Product | null; error: string | null }> {
  const supabase = await db()
  const { data, error } = await supabase.from('products').insert(product).select().single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Product, error: null }
}

export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>>,
): Promise<{ data: Product | null; error: string | null }> {
  const supabase = await db()
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Product, error: null }
}

export async function archiveProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await updateProduct(id, {
    is_archived: true,
    archived_at: new Date().toISOString(),
    is_available: false,
    is_featured: false,
    is_recommended: false,
    is_best_seller: false,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Archive is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function restoreProduct(id: string): Promise<{ error: string | null }> {
  const { error } = await updateProduct(id, {
    is_archived: false,
    archived_at: null,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Restore is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function updateProductsSortOrder(
  updates: { id: string; sort_order: number }[],
): Promise<{ error: string | null }> {
  const supabase = await db()
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('products').update({ sort_order }).eq('id', id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) return { error: getSupabaseErrorMessage(failed.error) }
  return { error: null }
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  const supabase = await db()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export async function getProductCount(): Promise<{ total: number; active: number }> {
  const supabase = await db()
  const countWithArchive = async (useArchiveFilter: boolean, availableOnly = false) => {
    let query = supabase.from('products').select('*', { count: 'exact', head: true })
    if (useArchiveFilter) query = query.eq('is_archived', false)
    if (availableOnly) query = query.eq('is_available', true)
    return query
  }

  let totalResult = await countWithArchive(true)
  if (totalResult.error && isMissingColumnError(totalResult.error, 'is_archived')) {
    totalResult = await countWithArchive(false)
  }

  let activeResult = await countWithArchive(true, true)
  if (activeResult.error && isMissingColumnError(activeResult.error, 'is_archived')) {
    activeResult = await countWithArchive(false, true)
  }

  return { total: totalResult.count || 0, active: activeResult.count || 0 }
}

export interface StockChangeResult {
  product: Product | null
  remaining: number | null
  hitLimit: boolean
  error: string | null
}

export async function getLowStockProducts(): Promise<Product[]> {
  try {
    const products = await getAllProducts({ archived: 'active' })
    return products.filter(isLowStock)
  } catch (err) {
    if (isMissingColumnError(err, 'stock_quantity') || isMissingColumnError(err, 'stock_alert_limit')) {
      return []
    }
    throw err
  }
}

export async function adjustProductStock(
  id: string,
  delta: number,
): Promise<StockChangeResult> {
  const product = await getProductById(id)
  if (!product) {
    return { product: null, remaining: null, hitLimit: false, error: 'Product not found' }
  }

  if (product.stock_quantity == null) {
    return { product, remaining: null, hitLimit: false, error: null }
  }

  const previous = product.stock_quantity
  const remaining = Math.max(0, previous + delta)
  const updates: Partial<Product> = { stock_quantity: remaining }
  if (remaining === 0) updates.is_available = false

  const { data, error } = await updateProduct(id, updates)
  if (error) {
    if (isMissingColumnError(error, 'stock_quantity')) {
      return {
        product,
        remaining: null,
        hitLimit: false,
        error: 'Stock tracking is not available yet. Run migration 017_product_stock.sql in Supabase.',
      }
    }
    return { product, remaining: previous, hitLimit: false, error }
  }

  const limit = data?.stock_alert_limit ?? product.stock_alert_limit
  const hitLimit =
    limit != null && previous > limit && remaining <= limit

  return { product: data, remaining, hitLimit, error: null }
}

export async function recordProductSale(id: string, quantity: number): Promise<StockChangeResult> {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { product: null, remaining: null, hitLimit: false, error: 'Enter a valid sold quantity (1 or higher).' }
  }

  const product = await getProductById(id)
  if (!product) {
    return { product: null, remaining: null, hitLimit: false, error: 'Product not found' }
  }
  if (product.stock_quantity == null) {
    return {
      product,
      remaining: null,
      hitLimit: false,
      error: 'Set available quantity for this product first.',
    }
  }

  return adjustProductStock(id, -Math.floor(quantity))
}

export async function applyEnquiryStockChange(
  items: { productId: string; quantity: number }[],
  direction: 'sold' | 'restore',
): Promise<StockChangeResult[]> {
  const results: StockChangeResult[] = []
  for (const item of items) {
    const delta = direction === 'sold' ? -item.quantity : item.quantity
    results.push(await adjustProductStock(item.productId, delta))
  }
  return results
}
