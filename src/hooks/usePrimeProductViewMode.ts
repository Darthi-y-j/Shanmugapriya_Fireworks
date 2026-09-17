import { useEffect, useState } from 'react'

export type PrimeProductViewMode = 'table' | 'card' | 'compact'

const STORAGE_KEY = 'shanmuga-shop-view-mode'

export function usePrimeProductViewMode(defaultMode: PrimeProductViewMode = 'table') {
  const [view, setView] = useState<PrimeProductViewMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'table' || stored === 'card' || stored === 'compact') return stored
    return defaultMode
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view)
  }, [view])

  return [view, setView] as const
}
