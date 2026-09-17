const DEFAULT_TTL_MS = 30 * 60 * 1000

interface SessionCacheEntry<T> {
  at: number
  data: T
}

export function readSessionCache<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | null {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionCacheEntry<T>
    if (!parsed?.data || Date.now() - parsed.at > ttlMs) return null
    return parsed.data
  } catch {
    return null
  }
}

export function writeSessionCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // sessionStorage may be full or unavailable
  }
}

export const CACHE_KEYS = {
  catalogueProducts: 'shanmuga-catalogue-products-v4',
  catalogueCategories: 'shanmuga-catalogue-categories-v2',
} as const
