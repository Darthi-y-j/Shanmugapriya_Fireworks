/** Split asset path into WebP + original fallback (query string preserved on both). */
export function assetWithWebp(src: string): { webp: string; fallback: string } {
  const queryIndex = src.indexOf('?')
  const base = queryIndex === -1 ? src : src.slice(0, queryIndex)
  const query = queryIndex === -1 ? '' : src.slice(queryIndex)

  if (base.endsWith('.webp')) {
    return { webp: src, fallback: src }
  }

  const webpBase = base.replace(/\.(png|jpe?g)$/i, '.webp')
  return {
    webp: `${webpBase}${query}`,
    fallback: src,
  }
}

const preloaded = new Set<string>()

/** Hint the browser to fetch a hero/background image early. */
export function preloadImage(src: string | null | undefined): void {
  if (!src || preloaded.has(src)) return
  preloaded.add(src)

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}
