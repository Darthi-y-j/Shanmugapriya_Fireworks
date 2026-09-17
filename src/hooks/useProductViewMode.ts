import { useEffect, useState } from 'react'

export type ProductViewMode = 'card' | 'table'

const STORAGE_KEY = 'prime-product-view-mode-v2'

export function useProductViewMode(defaultMode: ProductViewMode = 'table') {
  const [view, setView] = useState<ProductViewMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'card' || stored === 'table' ? stored : defaultMode
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view)
  }, [view])

  return [view, setView] as const
}
