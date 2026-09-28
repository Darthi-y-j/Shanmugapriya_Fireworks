/** Early connection to Supabase (storage + API) so product images start faster. */
export function preconnectSupabase(): void {
  const raw = import.meta.env.VITE_SUPABASE_URL
  if (!raw || typeof document === 'undefined') return

  let origin: string
  try {
    origin = new URL(raw).origin
  } catch {
    return
  }

  for (const rel of ['preconnect', 'dns-prefetch'] as const) {
    const selector = `link[rel="${rel}"][href="${origin}"]`
    if (document.head.querySelector(selector)) continue
    const link = document.createElement('link')
    link.rel = rel
    link.href = origin
    if (rel === 'preconnect') link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }
}
