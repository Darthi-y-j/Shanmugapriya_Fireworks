import { isSupabaseConfigured, normalizeSupabaseUrl } from '@/lib/supabase'
import {
  isLandingPage,
  logLandingPageApi,
  logLandingPageApiError,
  sanitizeApiUrl,
} from '@/lib/landingPageApiLog'

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const REST_TIMEOUT_MS = 12_000

export async function supabaseRestGet<T>(table: string, query: string): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const url = `${supabaseUrl}/rest/v1/${table}?${query}`
  const landing = isLandingPage()
  const startedAt = performance.now()

  if (landing) {
    logLandingPageApi('supabaseRestGet:start', { table, url: sanitizeApiUrl(url) })
  }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await response.text()
      if (landing) {
        logLandingPageApiError('supabaseRestGet:error', {
          table,
          status: response.status,
          ms: Math.round(performance.now() - startedAt),
        })
      }
      throw new Error(body || `Supabase request failed (${response.status})`)
    }

    const data = (await response.json()) as T
    if (landing) {
      const rows = Array.isArray(data) ? data.length : 1
      logLandingPageApi('supabaseRestGet:done', {
        table,
        rows,
        ms: Math.round(performance.now() - startedAt),
      })
    }
    return data
  } catch (error) {
    if (landing) {
      logLandingPageApiError('supabaseRestGet:error', {
        table,
        ms: Math.round(performance.now() - startedAt),
        error: error instanceof Error ? error.message : String(error),
      })
    }
    throw error
  } finally {
    window.clearTimeout(timer)
  }
}
