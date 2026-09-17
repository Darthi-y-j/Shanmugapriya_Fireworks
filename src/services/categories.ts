import { supabase, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import { supabaseRestGet } from '@/lib/supabaseRest'
import { logLandingPageApi, logLandingPageApiError } from '@/lib/landingPageApiLog'
import { CACHE_KEYS, readSessionCache, writeSessionCache } from '@/lib/sessionCache'
import type { Category } from '@/types/database'

export type CategoryArchiveFilter = 'active' | 'archived' | 'all'

export function getCachedCatalogueCategories(): Category[] | null {
  return readSessionCache<Category[]>(CACHE_KEYS.catalogueCategories)
}

export async function getCategories(
  activeOnly = true,
  archived: CategoryArchiveFilter = 'active',
): Promise<Category[]> {
  logLandingPageApi('getCategories:start', { activeOnly, archived })
  const startedAt = performance.now()

  const fetchRest = (withArchiveFilter: boolean) => {
    const parts = ['select=*', 'order=sort_order.asc']
    if (activeOnly) {
      parts.push('is_active=eq.true')
      if (withArchiveFilter) parts.push('is_archived=eq.false')
    } else if (withArchiveFilter) {
      if (archived === 'archived') parts.push('is_archived=eq.true')
      else if (archived !== 'all') parts.push('is_archived=eq.false')
    }
    return supabaseRestGet<Category[]>('categories', parts.join('&'))
  }

  try {
    const data = await fetchRest(true)
    if (activeOnly && archived === 'active') {
      writeSessionCache(CACHE_KEYS.catalogueCategories, data)
    }
    logLandingPageApi('getCategories:done', {
      count: data.length,
      ms: Math.round(performance.now() - startedAt),
    })
    return data
  } catch (error) {
    if (isMissingColumnError(error, 'is_archived')) {
      if (archived === 'archived') return []
      const data = await fetchRest(false)
      if (activeOnly && archived === 'active') {
        writeSessionCache(CACHE_KEYS.catalogueCategories, data)
      }
      logLandingPageApi('getCategories:done', {
        count: data.length,
        ms: Math.round(performance.now() - startedAt),
        fallback: 'no_is_archived_column',
      })
      return data
    }
    logLandingPageApiError('getCategories:error', {
      ms: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const withArchive = async (useArchiveFilter: boolean) => {
    let query = supabase.from('categories').select('*').eq('slug', slug).eq('is_active', true)
    if (useArchiveFilter) query = query.eq('is_archived', false)
    return query.single()
  }

  const { data, error } = await withArchive(true)
  if (!error) return data as Category

  if (isMissingColumnError(error, 'is_archived')) {
    const { data: fallback, error: fallbackError } = await withArchive(false)
    if (fallbackError) return null
    return fallback as Category
  }

  return null
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

  if (error) return null
  return data as Category
}

export async function createCategory(
  category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'is_archived' | 'archived_at'> & {
    is_archived?: boolean
    archived_at?: string | null
  },
): Promise<{ data: Category | null; error: string | null }> {
  const { data, error } = await supabase.from('categories').insert(category).select().single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Category, error: null }
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>,
): Promise<{ data: Category | null; error: string | null }> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Category, error: null }
}

export async function archiveCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await updateCategory(id, {
    is_archived: true,
    archived_at: new Date().toISOString(),
    is_active: false,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Archive is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function restoreCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await updateCategory(id, {
    is_archived: false,
    archived_at: null,
    is_active: true,
  })
  if (error && isMissingColumnError(error, 'is_archived')) {
    return { error: 'Restore is not available yet. Run migration 014_archive_products_categories.sql in Supabase.' }
  }
  return { error }
}

export async function updateCategoriesSortOrder(
  updates: { id: string; sort_order: number }[],
): Promise<{ error: string | null }> {
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('categories').update({ sort_order }).eq('id', id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed?.error) return { error: getSupabaseErrorMessage(failed.error) }
  return { error: null }
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}
