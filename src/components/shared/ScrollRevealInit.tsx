import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const REVEAL_SELECTOR = '[data-reveal]'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function revealElement(el: Element) {
  el.classList.add('scroll-revealed')
}

function observeElement(el: Element, observer: IntersectionObserver) {
  if (el.classList.contains('scroll-revealed')) return
  observer.observe(el)
}

function scanForReveals(root: ParentNode, observer: IntersectionObserver) {
  if (root instanceof Element && root.matches(REVEAL_SELECTOR)) {
    observeElement(root, observer)
  }
  root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => observeElement(el, observer))
}

export function ScrollRevealInit() {
  const location = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach(revealElement)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          revealElement(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0, rootMargin: '0px 0px 8% 0px' },
    )

    const scan = () => {
      const root = document.getElementById('root')
      if (!root) return
      scanForReveals(root, observer)
    }

    scan()
    const t1 = window.setTimeout(scan, 200)

    return () => {
      window.clearTimeout(t1)
      observer.disconnect()
    }
  }, [location.pathname, location.hash])

  return null
}
