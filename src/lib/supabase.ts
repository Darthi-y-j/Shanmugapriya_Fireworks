import type { SupabaseClient } from '@supabase/supabase-js'
import {
  isLandingPage,
  logLandingPageApi,
  logLandingPageApiError,
  sanitizeApiUrl,
} from '@/lib/landingPageApiLog'
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabaseConfig'

export { isSupabaseConfigured, normalizeSupabaseUrl } from '@/lib/supabaseConfig'

const supabaseFetch: typeof fetch = (input, init) => {
  const timeoutMs = 12_000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const landing = isLandingPage()
  const url =
    typeof input === 'string'
      ? input
      : input instanceof Request
        ? input.url
        : String(input)
  const method = init?.method ?? (input instanceof Request ? input.method : 'GET')
  const startedAt = performance.now()

  if (landing) {
    logLandingPageApi('fetch:start', { method, url: sanitizeApiUrl(url) })
  }

  const cleanup = () => clearTimeout(timer)

  if (init?.signal) {
    init.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return fetch(input, { ...init, signal: controller.signal })
    .then((response) => {
      if (landing) {
        logLandingPageApi('fetch:done', {
          method,
          url: sanitizeApiUrl(url),
          status: response.status,
          ok: response.ok,
          ms: Math.round(performance.now() - startedAt),
        })
      }
      return response
    })
    .finally(cleanup)
    .catch((error) => {
      if (landing) {
        logLandingPageApiError('fetch:error', {
          method,
          url: sanitizeApiUrl(url),
          ms: Math.round(performance.now() - startedAt),
          error: error instanceof Error ? error.message : String(error),
        })
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Supabase request timed out')
      }
      throw error
    })
}

let client: SupabaseClient | null = null
let clientPromise: Promise<SupabaseClient> | null = null

/** Lazy-load Supabase client so the SDK is not on the homepage critical path. */
export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (client) return client
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      client = isSupabaseConfigured
        ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { fetch: supabaseFetch } })
        : createClient('https://placeholder.supabase.co', 'placeholder-key')
      return client
    })
  }
  return clientPromise
}

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: string }).message)
  }
  return 'An unexpected error occurred'
}

/** True when PostgREST/Supabase reports a column missing from the schema cache. */
export function isMissingColumnError(error: unknown, column?: string): boolean {
  const message = getSupabaseErrorMessage(error).toLowerCase()
  const code = (error as { code?: string })?.code
  const missingColumn =
    code === 'PGRST204' || message.includes('schema cache') || message.includes('could not find')
  if (!missingColumn) return false
  if (!column) return true
  return message.includes(column.toLowerCase())
}
