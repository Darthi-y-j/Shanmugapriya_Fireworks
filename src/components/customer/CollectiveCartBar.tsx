import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, MessageCircle, X, ChevronUp, Trash2, Gift } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { QuantitySelector } from './QuantitySelector'
import { getImageUrl, formatPrice, cn } from '@/lib/utils'

export function CollectiveCartBar() {
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart()
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (items.length === 0) return null

  const handleClearCart = () => {
    clearCart()
    setOpen(false)
    setShowClearConfirm(false)
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
      {showClearConfirm && (
        <div className="mb-2 w-[min(18rem,calc(100dvw-2rem))] animate-fade-up overflow-hidden rounded-xl border border-red-500/30 bg-navy-950 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <div className="p-3">
            <p className="text-sm font-semibold text-white">Clear entire cart?</p>
            <p className="mt-1 text-xs text-white/60">
              This will remove all {itemCount} item{itemCount !== 1 ? 's' : ''} from your cart.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-2 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Keep items
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {open && !showClearConfirm && (
        <div className="mb-2 w-[min(18rem,calc(100dvw-2rem))] animate-fade-up overflow-hidden rounded-xl border border-gold-500/25 bg-navy-950 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <p className="text-xs font-semibold text-cream-100">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setShowClearConfirm(true)
                }}
                className="rounded-md px-2 py-1 text-[10px] font-semibold text-red-300 hover:bg-red-500/15"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Close cart panel"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-44 space-y-2 overflow-y-auto p-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.productName}
                  className="h-8 w-8 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1 truncate text-[11px] font-medium text-white">
                      {item.isGiftBox && <Gift className="h-3 w-3 shrink-0 text-gold-400" />}
                      <span className="truncate">{item.productName}</span>
                    </p>
                    {formatPrice(item.price) ? (
                      <span className="shrink-0 text-[11px] font-bold tabular-nums text-gold-400">
                        {formatPrice(item.price)}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-semibold text-festive-400">Enquire</span>
                    )}
                  </div>
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.productId, qty)}
                    variant="ember"
                    compact
                    className="mt-1 [&_button]:h-7 [&_button]:w-7 [&_span]:min-h-7 [&_span]:text-[11px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="shrink-0 rounded-full p-1 text-white/45 hover:bg-red-500/20 hover:text-red-400"
                  aria-label={`Remove ${item.productName}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 border-t border-white/10 p-2">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/20 px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-white/10"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
            </Link>
            {settings.whatsapp_number && (
              <Link
                to="/cart#send-enquiry"
                onClick={() => setOpen(false)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#25D366] px-2 py-1.5 text-[11px] font-semibold text-white hover:bg-[#20bd5a]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </Link>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-full border border-gold-500/35 bg-navy-950 text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-gold-400/50 hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)]',
          open && 'ring-2 ring-gold-400/40',
          showClearConfirm && 'ring-2 ring-red-400/40',
        )}
      >
        <button
          type="button"
          onClick={() => {
            setShowClearConfirm(false)
            setOpen((prev) => !prev)
          }}
          className="flex items-center gap-2 px-3 py-2"
          aria-expanded={open}
          aria-label={`Cart, ${itemCount} items`}
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/15">
            <ShoppingCart className="h-4 w-4 text-gold-400" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-festive-500 px-1 text-[9px] font-bold text-white">
              {itemCount}
            </span>
          </span>
          <span className="hidden text-xs font-semibold sm:inline">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        </button>

        <div className="w-px self-stretch bg-white/15" aria-hidden="true" />

        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setShowClearConfirm(true)
          }}
          className="flex items-center px-2.5 text-white/55 transition-colors hover:bg-red-500/15 hover:text-red-300 sm:px-3"
          aria-label="Clear entire cart"
          title="Clear cart"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
