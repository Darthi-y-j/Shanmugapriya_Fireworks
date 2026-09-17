/** Offset for fixed navbar when scrolling to category sections */
export const SCROLL_OFFSET = 80

export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'auto') {
  const top = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior })
}

export function scrollToCategorySection(
  categoryId: string,
  behavior: ScrollBehavior = 'auto',
): boolean {
  const element = document.getElementById(`category-${categoryId}`)
  if (!element) return false
  scrollToElement(element, behavior)
  return true
}

/** Re-scroll as layout settles (lazy sections, images, grids). Returns cleanup. */
export function scrollToCategorySectionReliable(categoryId: string): () => void {
  const timeouts: number[] = []

  const scroll = () => scrollToCategorySection(categoryId, 'auto')

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scroll()
      for (const delay of [80, 200, 400, 700]) {
        timeouts.push(window.setTimeout(scroll, delay))
      }
    })
  })

  return () => {
    for (const id of timeouts) window.clearTimeout(id)
  }
}
