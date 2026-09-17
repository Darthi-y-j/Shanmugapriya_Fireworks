import type { Product } from '@/types/database'

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  const discount = Math.min(Math.max(discountPercent, 0), 100)
  const discounted = originalPrice * (1 - discount / 100)
  return Math.round(discounted * 100) / 100
}

/** Original price from selling price and discount percent. */
export function calculateOriginalFromSelling(
  sellingPrice: number,
  discountPercent: number
): number {
  const discount = Math.min(Math.max(discountPercent, 0), 100)
  if (discount >= 100) return sellingPrice
  if (discount <= 0) return sellingPrice
  const original = sellingPrice / (1 - discount / 100)
  return Math.round(original * 100) / 100
}

/** Selling price shown to customers (uses stored price or calculates from original + discount). */
export function resolveProductPrice(product: {
  price?: number | null
  original_price?: number | null
  discount_percentage?: number | null
}): number | null {
  if (product.price != null) return product.price

  if (
    product.original_price != null &&
    product.discount_percentage != null &&
    product.discount_percentage > 0
  ) {
    return calculateDiscountedPrice(product.original_price, product.discount_percentage)
  }

  if (product.original_price != null && !product.discount_percentage) {
    return product.original_price
  }

  return null
}

export function resolveOriginalPriceForDisplay(product: {
  price?: number | null
  original_price?: number | null
  discount_percentage?: number | null
}): number | null {
  const selling = resolveProductPrice(product)
  if (selling == null) return null

  if (product.original_price != null && product.original_price > selling) {
    return product.original_price
  }

  const discount = product.discount_percentage ?? 0
  if (discount > 0 && discount < 100) {
    const derived = selling / (1 - discount / 100)
    const rounded = Math.round(derived * 100) / 100
    if (rounded > selling) return rounded
  }

  return null
}

export function shouldShowOriginalPrice(product: {
  price?: number | null
  original_price?: number | null
  discount_percentage?: number | null
}): boolean {
  return resolveOriginalPriceForDisplay(product) != null
}

export function buildProductPricingPayload(
  originalPriceInput: string,
  discountInput: string
): {
  price: number | null
  original_price: number | null
  discount_percentage: number | null
  error?: string
} {
  const originalRaw = originalPriceInput.trim()
  const discountRaw = discountInput.trim()

  if (!originalRaw) {
    return { price: null, original_price: null, discount_percentage: null }
  }

  const original = parseFloat(originalRaw)
  if (Number.isNaN(original) || original < 0) {
    return {
      price: null,
      original_price: null,
      discount_percentage: null,
      error: 'Enter a valid original price.',
    }
  }

  const discount = discountRaw ? parseFloat(discountRaw) : 0
  if (Number.isNaN(discount) || discount < 0 || discount > 100) {
    return {
      price: null,
      original_price: null,
      discount_percentage: null,
      error: 'Discount must be between 0 and 100.',
    }
  }

  if (discount > 0) {
    return {
      price: calculateDiscountedPrice(original, discount),
      original_price: original,
      discount_percentage: discount,
    }
  }

  return {
    price: original,
    original_price: null,
    discount_percentage: null,
  }
}

export function formatPricingPreview(
  originalPriceInput: string,
  discountInput: string,
  formatPrice: (price: number | null | undefined) => string | null
): { selling: string | null; original: string | null; hasDiscount: boolean } {
  const payload = buildProductPricingPayload(originalPriceInput, discountInput)
  if (payload.error || payload.price == null) {
    return { selling: null, original: null, hasDiscount: false }
  }

  return {
    selling: formatPrice(payload.price),
    original: payload.original_price ? formatPrice(payload.original_price) : null,
    hasDiscount: Boolean(payload.original_price && payload.discount_percentage),
  }
}

export type PricedProduct = Pick<Product, 'price' | 'original_price' | 'discount_percentage'>
