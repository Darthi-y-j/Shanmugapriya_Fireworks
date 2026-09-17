import type { CartItem } from '@/types/database'

const STORAGE_KEY = 'shanmuga-enquiry-cart'

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

type CartItemSnapshot = { inCart: boolean; quantity: number }

let cartItems: CartItem[] = loadCart()
const listeners = new Set<() => void>()
const itemSnapshots = new Map<string, CartItemSnapshot>()
let countSnapshot = cartItems.reduce((sum, item) => sum + item.quantity, 0)

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function invalidateSnapshots() {
  itemSnapshots.clear()
  countSnapshot = cartItems.reduce((sum, item) => sum + item.quantity, 0)
}

function updateCart(updater: (prev: CartItem[]) => CartItem[]) {
  cartItems = updater(cartItems)
  invalidateSnapshots()
  saveCart(cartItems)
  emitChange()
}

export function getCartItems(): CartItem[] {
  return cartItems
}

export function getCartItemCount(): number {
  return countSnapshot
}

export function getCartItemSnapshot(productId: string): CartItemSnapshot {
  const item = cartItems.find((i) => i.productId === productId)
  const next: CartItemSnapshot = { inCart: !!item, quantity: item?.quantity ?? 0 }
  const prev = itemSnapshots.get(productId)
  if (prev && prev.inCart === next.inCart && prev.quantity === next.quantity) {
    return prev
  }
  itemSnapshots.set(productId, next)
  return next
}

export function setCartItem(item: CartItem) {
  if (item.quantity < 1) {
    updateCart((prev) => prev.filter((i) => i.productId !== item.productId))
    return
  }
  updateCart((prev) => {
    const existing = prev.find((i) => i.productId === item.productId)
    if (existing) {
      return prev.map((i) => (i.productId === item.productId ? item : i))
    }
    return [...prev, item]
  })
}

export function addCartItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  updateCart((prev) => {
    const existing = prev.find((i) => i.productId === item.productId)
    if (existing) {
      return prev.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
      )
    }
    return [...prev, { ...item, quantity }]
  })
}

export function removeCartItem(productId: string) {
  updateCart((prev) => prev.filter((i) => i.productId !== productId))
}

export function updateCartQuantity(productId: string, quantity: number) {
  if (quantity < 1) {
    removeCartItem(productId)
    return
  }
  updateCart((prev) =>
    prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
  )
}

export function clearCartItems() {
  updateCart(() => [])
}

export function subscribeToCart(listener: () => void) {
  return subscribe(listener)
}
