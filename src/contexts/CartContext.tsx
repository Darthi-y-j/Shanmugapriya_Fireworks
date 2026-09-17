import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { CartItem } from '@/types/database'
import {
  addCartItem,
  clearCartItems,
  getCartItemCount,
  getCartItemSnapshot,
  getCartItems,
  removeCartItem,
  setCartItem,
  subscribeToCart,
  updateCartQuantity,
} from '@/lib/cartStore'

interface CartContextType {
  items: CartItem[]
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  setCartItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartItems, getCartItems)
  const itemCount = useSyncExternalStore(subscribeToCart, getCartItemCount, getCartItemCount)

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    addCartItem(item, quantity)
  }, [])

  const setItem = useCallback((item: CartItem) => {
    setCartItem(item)
  }, [])

  const removeItemHandler = useCallback((productId: string) => {
    removeCartItem(productId)
  }, [])

  const updateQuantityHandler = useCallback((productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity)
  }, [])

  const clearCart = useCallback(() => {
    clearCartItems()
  }, [])

  const isInCart = useCallback((productId: string) => getCartItemSnapshot(productId).inCart, [])

  const getItemQuantity = useCallback(
    (productId: string) => getCartItemSnapshot(productId).quantity,
    [],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        setCartItem: setItem,
        removeItem: removeItemHandler,
        updateQuantity: updateQuantityHandler,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export function useCartItem(productId: string) {
  return useSyncExternalStore(
    subscribeToCart,
    () => getCartItemSnapshot(productId),
    () => getCartItemSnapshot(productId),
  )
}
