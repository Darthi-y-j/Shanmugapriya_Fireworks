import type { CartItem, EnquiryItem, GiftBoxContentItem } from '@/types/database'
import { isValidUuid, sanitizeEnquiryProductId } from '@/lib/utils'

export function giftBoxLineTotal(items: GiftBoxContentItem[]): number | null {
  let total = 0
  let hasPrice = false
  for (const item of items) {
    if (item.price == null) continue
    hasPrice = true
    total += item.price * item.quantity
  }
  return hasPrice ? Math.round(total * 100) / 100 : null
}

export function giftBoxItemCount(items: GiftBoxContentItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function createGiftBoxCartItem(contents: GiftBoxContentItem[]): Omit<CartItem, 'quantity'> {
  const count = giftBoxItemCount(contents)
  const total = giftBoxLineTotal(contents)
  return {
    productId: `gift-box-${Date.now()}`,
    productName: `Custom Gift Box (${count} item${count === 1 ? '' : 's'})`,
    slug: 'gift-box',
    imageUrl: contents[0]?.imageUrl ?? null,
    price: total,
    isGiftBox: true,
    giftBoxItems: contents.map((item) => ({ ...item })),
  }
}

export function enquiryHeaderProductId(items: CartItem[]): string | null {
  const first = items[0]
  if (!first) return null
  if (first.isGiftBox) {
    const innerId = first.giftBoxItems?.find((item) => isValidUuid(item.productId))?.productId
    return sanitizeEnquiryProductId(innerId ?? null)
  }
  return sanitizeEnquiryProductId(first.productId)
}

export function expandCartItemsForEnquiry(items: CartItem[]): EnquiryItem[] {
  const result: EnquiryItem[] = []

  for (const item of items) {
    if (item.isGiftBox && item.giftBoxItems?.length) {
      for (const inner of item.giftBoxItems) {
        result.push({
          product_id: inner.productId,
          product_name: `Gift Box: ${inner.productName}`,
          quantity: inner.quantity * item.quantity,
          price: inner.price,
        })
      }
      continue
    }

    result.push({
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
    })
  }

  return result
}
