const scrollPositions = new Map<string, number>()
const STORAGE_PREFIX = 'prime-scroll:'

export function getScrollKey(pathname: string, search: string) {
  return `${pathname}${search}`
}

export function saveScrollPosition(key: string, y: number) {
  if (!Number.isFinite(y) || y < 0) return
  const previous = scrollPositions.get(key)
  if (previous !== undefined && y === 0 && previous > 0) return
  scrollPositions.set(key, y)
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, String(Math.round(y)))
  } catch {
    // sessionStorage may be unavailable in private mode
  }
}

export function getSavedScrollPosition(key: string): number | undefined {
  const cached = scrollPositions.get(key)
  if (cached !== undefined) return cached

  try {
    const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`)
    if (stored != null) {
      const y = Number(stored)
      if (Number.isFinite(y) && y >= 0) {
        scrollPositions.set(key, y)
        return y
      }
    }
  } catch {
    // ignore
  }

  return undefined
}

/** Re-apply scroll after async layout (product grids, images). */
export function restoreScrollPosition(y: number) {
  const scroll = () => {
    window.scrollTo(0, y)
  }

  scroll()
  requestAnimationFrame(scroll)

  const timeouts: number[] = []
  for (const delay of [50, 150, 350, 700, 1200]) {
    timeouts.push(window.setTimeout(scroll, delay))
  }

  return () => {
    for (const id of timeouts) window.clearTimeout(id)
  }
}
