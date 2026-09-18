import { CACHE_KEYS, readSessionCache } from '@/lib/sessionCache'
import type { Category } from '@/types/database'

export function getCachedCatalogueCategories(): Category[] | null {
  return readSessionCache<Category[]>(CACHE_KEYS.catalogueCategories)
}
