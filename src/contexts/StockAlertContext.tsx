import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import { getLowStockProducts, type StockChangeResult } from '@/services/products'
import type { Product } from '@/types/database'
import { isLowStock } from '@/lib/stock'

export interface StockAlertNotice {
  id: string
  name: string
  remaining: number
  limit: number
}

interface StockAlertContextValue {
  lowStockProducts: Product[]
  popupAlerts: StockAlertNotice[]
  refreshLowStock: () => Promise<Product[]>
  showStockAlerts: (results: StockChangeResult[]) => void
  dismissPopup: () => void
}

const StockAlertContext = createContext<StockAlertContextValue | null>(null)

function isProductAdminPath(pathname: string) {
  return pathname === '/admin/products' || pathname.startsWith('/admin/products/')
}

function toNotice(product: Product, remaining?: number | null): StockAlertNotice {
  return {
    id: product.id,
    name: product.name,
    remaining: remaining ?? product.stock_quantity ?? 0,
    limit: product.stock_alert_limit ?? 0,
  }
}

function mergeNotices(base: StockAlertNotice[], extra: StockAlertNotice[]) {
  const map = new Map(base.map((notice) => [notice.id, notice]))
  for (const notice of extra) map.set(notice.id, notice)
  return [...map.values()]
}

function noticesFromResults(results: StockChangeResult[]) {
  return results
    .filter((result) => result.hitLimit && result.product)
    .map((result) => toNotice(result.product!, result.remaining))
}

export function StockAlertProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [popupAlerts, setPopupAlerts] = useState<StockAlertNotice[]>([])
  const pendingRef = useRef<StockAlertNotice[]>([])
  const previousPathRef = useRef(location.pathname)

  const refreshLowStock = useCallback(async () => {
    try {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
      return products
    } catch {
      setLowStockProducts([])
      return [] as Product[]
    }
  }, [])

  const applyStockResults = useCallback((results: StockChangeResult[]) => {
    setLowStockProducts((prev) => {
      const next = [...prev]
      for (const result of results) {
        const product = result.product
        if (!product) continue
        const index = next.findIndex((item) => item.id === product.id)
        if (isLowStock(product)) {
          if (index >= 0) next[index] = product
          else next.push(product)
        } else if (index >= 0) {
          next.splice(index, 1)
        }
      }
      return next
    })
  }, [])

  const presentGatheredAlerts = useCallback(
    async (seed: StockAlertNotice[] = []) => {
      const products = await refreshLowStock()
      const gathered = products.filter(isLowStock).map((product) => toNotice(product))
      const combined = mergeNotices(seed, gathered)
      if (combined.length > 0) setPopupAlerts(combined)
    },
    [refreshLowStock],
  )

  useEffect(() => {
    void refreshLowStock()
  }, [refreshLowStock])

  useEffect(() => {
    const previousPath = previousPathRef.current
    previousPathRef.current = location.pathname

    const leftProductPage = isProductAdminPath(previousPath) && !isProductAdminPath(location.pathname)
    if (!leftProductPage || pendingRef.current.length === 0) return

    const seed = pendingRef.current
    pendingRef.current = []
    void presentGatheredAlerts(seed)
  }, [location.pathname, presentGatheredAlerts])

  const showStockAlerts = useCallback(
    (results: StockChangeResult[]) => {
      applyStockResults(results)

      const notices = noticesFromResults(results)
      if (notices.length === 0) return

      if (isProductAdminPath(location.pathname)) {
        pendingRef.current = mergeNotices(pendingRef.current, notices)
        return
      }

      pendingRef.current = []
      void presentGatheredAlerts(notices)
    },
    [applyStockResults, location.pathname, presentGatheredAlerts],
  )

  const dismissPopup = useCallback(() => setPopupAlerts([]), [])

  return (
    <StockAlertContext.Provider
      value={{ lowStockProducts, popupAlerts, refreshLowStock, showStockAlerts, dismissPopup }}
    >
      {children}
    </StockAlertContext.Provider>
  )
}

export function useStockAlerts() {
  const context = useContext(StockAlertContext)
  if (!context) {
    throw new Error('useStockAlerts must be used within StockAlertProvider')
  }
  return context
}
