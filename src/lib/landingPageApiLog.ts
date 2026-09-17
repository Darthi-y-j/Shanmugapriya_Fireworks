const LANDING_PATHS = new Set(['/', '/home'])

export function isLandingPage(): boolean {
  if (typeof window === 'undefined') return false
  return LANDING_PATHS.has(window.location.pathname)
}

export function logLandingPageApi(
  name: string,
  detail: Record<string, unknown> = {},
): void {
  if (!isLandingPage()) return
  console.log(`[Landing API] ${name}`, detail)
}

export function logLandingPageApiError(
  name: string,
  detail: Record<string, unknown> = {},
): void {
  if (!isLandingPage()) return
  console.error(`[Landing API] ${name}`, detail)
}

/** Strip query tokens from Supabase URLs before logging. */
export function sanitizeApiUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin)
    return `${parsed.pathname}${parsed.search ? '?…' : ''}`
  } catch {
    return url.split('?')[0]
  }
}
