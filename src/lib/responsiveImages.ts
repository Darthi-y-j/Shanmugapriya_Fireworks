const IMG_VERSION = '4'

function stripQuery(src: string): string {
  const i = src.indexOf('?')
  return i === -1 ? src : src.slice(0, i)
}

function withVersion(path: string): string {
  return `${path}?v=${IMG_VERSION}`
}

/** Responsive WebP srcset for full-bleed hero background (LCP). */
export function heroBackgroundSrcSet(src: string): { srcSet: string; sizes: string; webp: string } {
  const base = stripQuery(src).replace(/\.(png|jpe?g|webp)$/i, '')
  const v = `?v=${IMG_VERSION}`
  return {
    webp: withVersion(`${base}.webp`),
    srcSet: [
      `${base}-800.webp${v} 800w`,
      `${base}-1200.webp${v} 1200w`,
      `${base}-1600.webp${v} 1600w`,
      `${base}.webp${v} 1920w`,
    ].join(', '),
    sizes: '100vw',
  }
}

export { IMG_VERSION as RESPONSIVE_IMG_VERSION }
