import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ShoppingCart, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice } from '@/lib/utils'

export function PrimeCartBar() {
  const { items, itemCount, clearCart } = useCart()
  const { showToast } = useToast()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (items.length === 0) return null

  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0)

  const handleClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
    showToast('Cart cleared', 'success')
  }

  return (
    <div className="prime-cart-bar fixed bottom-0 left-0 right-0 z-40 border-t-2 border-[#C9A24A]/70 bg-[#0F2847] shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6">
        {showClearConfirm ? (
          <>
            <p className="min-w-0 text-sm font-semibold text-white">
              Remove all {itemCount} item{itemCount !== 1 ? 's' : ''} from cart?
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-full border border-white/30 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 sm:px-4 sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-full bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-400 sm:px-4 sm:text-sm"
              >
                Clear cart
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-red-400/60 hover:bg-red-500/15 hover:text-red-300"
                aria-label="Clear cart"
                title="Clear cart"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#E8C56A]/90">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} selected
                </p>
                <p className="font-sans text-lg font-bold text-white">
                  {total > 0 ? formatPrice(total) : 'Enquiry cart'}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-4"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">View Cart</span>
              </Link>
              <Link
                to="/cart#send-enquiry"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 sm:px-4"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
