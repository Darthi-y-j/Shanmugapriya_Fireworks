import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import {
  getSavedScrollPosition,
  getScrollKey,
  restoreScrollPosition,
} from '@/lib/scrollRestore'

/** Call after list content finishes loading so back-navigation lands on the same row. */
export function useRestoreScrollAfterLoad(loading: boolean) {
  const { pathname, search } = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (loading || navigationType !== 'POP') return

    const key = getScrollKey(pathname, search)
    const savedY = getSavedScrollPosition(key)
    if (savedY === undefined) return

    return restoreScrollPosition(savedY)
  }, [loading, navigationType, pathname, search])
}
