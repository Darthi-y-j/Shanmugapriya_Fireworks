import type { Product, WishlistItem } from '@/types/database'
import { resolveProductPrice } from '@/lib/pricing'

const STORAGE_KEY = 'shanmuga-wishlist'

function loadWishlist(): WishlistItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as WishlistItem[]) : []
  } catch {
    return []
  }
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

let wishlistItems: WishlistItem[] = loadWishlist()
const listeners = new Set<() => void>()
const wishlistedSnapshots = new Map<string, boolean>()
let countSnapshot = wishlistItems.length

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function invalidateSnapshots() {
  wishlistedSnapshots.clear()
  countSnapshot = wishlistItems.length
}

function updateWishlist(updater: (prev: WishlistItem[]) => WishlistItem[]) {
  wishlistItems = updater(wishlistItems)
  invalidateSnapshots()
  saveWishlist(wishlistItems)
  emitChange()
}

export function getWishlistItems(): WishlistItem[] {
  return wishlistItems
}

export function getWishlistCount(): number {
  return countSnapshot
}

export function getWishlistedSnapshot(productId: string): boolean {
  const next = wishlistItems.some((i) => i.productId === productId)
  const prev = wishlistedSnapshots.get(productId)
  if (prev === next) return prev
  wishlistedSnapshots.set(productId, next)
  return next
}

export function addWishlistItem(item: Omit<WishlistItem, 'addedAt'>) {
  updateWishlist((prev) => {
    if (prev.some((i) => i.productId === item.productId)) return prev
    return [...prev, { ...item, addedAt: new Date().toISOString() }]
  })
}

export function removeWishlistItem(productId: string) {
  updateWishlist((prev) => prev.filter((i) => i.productId !== productId))
}

export function toggleWishlistItem(product: Product): boolean {
  let added = false
  updateWishlist((prev) => {
    const exists = prev.some((i) => i.productId === product.id)
    if (exists) {
      added = false
      return prev.filter((i) => i.productId !== product.id)
    }
    added = true
    return [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        slug: product.slug,
        imageUrl: product.image_url,
        price: resolveProductPrice(product),
        addedAt: new Date().toISOString(),
      },
    ]
  })
  return added
}

export function clearWishlistItems() {
  updateWishlist(() => [])
}

export function subscribeToWishlist(listener: () => void) {
  return subscribe(listener)
}
