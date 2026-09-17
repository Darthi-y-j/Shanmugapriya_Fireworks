import { useEffect, useState } from 'react'
import type { Product } from '@/types/database'
import { formatPrice } from '@/lib/utils'
import { resolveProductPrice, resolveOriginalPriceForDisplay } from '@/lib/pricing'
import { useCartItem } from '@/contexts/CartContext'
import { buildCartItemFromProduct } from '@/lib/cartItem'
import { setCartItem } from '@/lib/cartStore'
import { useToast } from '@/contexts/ToastContext'

export function useProductCartState(product: Product) {
  const { inCart, quantity: cartQty } = useCartItem(product.id)
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState(inCart ? cartQty : 1)

  useEffect(() => {
    if (inCart) setQuantity(cartQty)
    else setQuantity(1)
  }, [inCart, cartQty])

  const sellingPrice = resolveProductPrice(product)
  const price = formatPrice(sellingPrice)
  const originalPriceValue = resolveOriginalPriceForDisplay(product)
  const originalPrice = originalPriceValue != null ? formatPrice(originalPriceValue) : null

  const handleQuantityChange = (qty: number) => {
    if (qty < 1) {
      setCartItem(buildCartItemFromProduct(product, 0, sellingPrice))
      setQuantity(1)
      return
    }

    setQuantity(qty)
    setCartItem(buildCartItemFromProduct(product, qty, sellingPrice))
  }

  const handleAddToCart = () => {
    setCartItem(buildCartItemFromProduct(product, quantity, sellingPrice))
    showToast(
      inCart ? `Updated ${product.name} quantity` : `Added ${product.name} to cart`,
      'success',
    )
  }

  return {
    inCart,
    quantity,
    sellingPrice,
    price,
    originalPrice,
    handleQuantityChange,
    handleAddToCart,
  }
}
