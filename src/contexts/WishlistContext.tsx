import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { Product, WishlistItem } from '@/types/database'
import {
  addWishlistItem,
  clearWishlistItems,
  getWishlistCount,
  getWishlistedSnapshot,
  getWishlistItems,
  removeWishlistItem,
  subscribeToWishlist,
  toggleWishlistItem,
} from '@/lib/wishlistStore'

interface WishlistContextType {
  items: WishlistItem[]
  itemCount: number
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => boolean
  clearWishlist: () => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToWishlist, getWishlistItems, getWishlistItems)
  const itemCount = useSyncExternalStore(subscribeToWishlist, getWishlistCount, getWishlistCount)

  const addItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    addWishlistItem(item)
  }, [])

  const removeItem = useCallback((productId: string) => {
    removeWishlistItem(productId)
  }, [])

  const toggleItem = useCallback((product: Product) => toggleWishlistItem(product), [])

  const clearWishlist = useCallback(() => {
    clearWishlistItems()
  }, [])

  const isWishlisted = useCallback(
    (productId: string) => getWishlistedSnapshot(productId),
    [],
  )

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        removeItem,
        toggleItem,
        clearWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export function useWishlistItem(productId: string) {
  return useSyncExternalStore(
    subscribeToWishlist,
    () => getWishlistedSnapshot(productId),
    () => getWishlistedSnapshot(productId),
  )
}
