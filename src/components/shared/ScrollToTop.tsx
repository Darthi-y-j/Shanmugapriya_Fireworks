import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import {
  getSavedScrollPosition,
  getScrollKey,
  restoreScrollPosition,
  saveScrollPosition,
} from '@/lib/scrollRestore'

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()
  const navigationType = useNavigationType()
  const scrollKey = getScrollKey(pathname, search)
  const prevKeyRef = useRef(scrollKey)
  const lastScrollYRef = useRef(0)

  useLayoutEffect(() => {
    const update = () => {
      lastScrollYRef.current = window.scrollY
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useLayoutEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== scrollKey) {
      saveScrollPosition(prevKey, lastScrollYRef.current)
      prevKeyRef.current = scrollKey
    }

    if (hash) return

    if (navigationType === 'POP') {
      const savedY = getSavedScrollPosition(scrollKey)
      if (savedY !== undefined) {
        return restoreScrollPosition(savedY)
      }
      return
    }

    window.scrollTo(0, 0)
    lastScrollYRef.current = 0
  }, [scrollKey, hash, navigationType])

  return null
}
