import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Sparkles,
  MessageCircle,
} from 'lucide-react'
import type { Product } from '@/types/database'
import { cn, formatPrice } from '@/lib/utils'
import { resolveProductPrice, resolveOriginalPriceForDisplay } from '@/lib/pricing'
import { QuantitySelector } from './QuantitySelector'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { DiscountOfferTag } from './DiscountOfferTag'
import { ProductHighlightBadges } from './ProductHighlightBadges'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'
import { ProductMediaCarousel } from './ProductMediaCarousel'
import { buildCartItemFromProduct } from '@/lib/cartItem'
import {
  CARD_TITLE_BASE_CLASS,
  getCardPerforationDotClass,
  getCardPerforationLineClass,
  getCardPricePanelClass,
  getCardTitleClass,
  isEliteProductTag,
} from '@/lib/productCardThemes'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { setCartItem, isInCart, getItemQuantity, removeItem } = useCart()
  const { showToast } = useToast()
  const inCart = isInCart(product.id)
  const cartQty = getItemQuantity(product.id)

  const [quantity, setQuantity] = useState(inCart ? cartQty : 1)

  useEffect(() => {
    if (inCart) setQuantity(cartQty)
    else setQuantity(1)
  }, [inCart, cartQty])

  const sellingPrice = resolveProductPrice(product)
  const price = formatPrice(sellingPrice)
  const originalPriceValue = resolveOriginalPriceForDisplay(product)
  const originalPrice = originalPriceValue != null ? formatPrice(originalPriceValue) : null
  const savings =
    originalPriceValue != null && sellingPrice != null
      ? formatPrice(originalPriceValue - sellingPrice)
      : null
  const specs = product.specifications ? Object.entries(product.specifications) : []
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const isElite = isEliteProductTag(product.tag)
  const discountVariant = isElite ? 'elite' : 'festive'

  const handleQuantityChange = (qty: number) => {
    if (inCart) {
      if (qty < 1) {
        removeItem(product.id)
        setQuantity(1)
        return
      }
      setQuantity(qty)
      setCartItem(buildCartItemFromProduct(product, qty, sellingPrice))
      return
    }
    setQuantity(Math.max(1, qty))
  }

  const handleAddToCart = () => {
    setCartItem(buildCartItemFromProduct(product, quantity, sellingPrice))
    showToast(`Added ${product.name} to cart`, 'success')
  }

  const priceBlock = (
    <div
      className={cn(
        'rounded-lg border border-white/10 px-2.5 py-2 ring-1',
        getCardPricePanelClass(product.tag),
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold-400/70">Your Price</p>
          {price ? (
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0">
              {originalPrice && (
                <span className="text-xs text-white/40 line-through">{originalPrice}</span>
              )}
              <span className="bg-gradient-to-r from-gold-300 via-amber-400 to-orange-400 bg-clip-text font-display text-xl font-bold tabular-nums text-transparent sm:text-2xl">
                {price}
              </span>
            </div>
          ) : (
            <span className="mt-0.5 inline-block bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-lg font-bold text-transparent">
              Enquire for price
            </span>
          )}
          {savings && (
            <p className="mt-1 text-xs font-semibold text-emerald-400/90">You save {savings}</p>
          )}
        </div>
        <ProductPiecesBadge product={product} className="shrink-0" />
      </div>
    </div>
  )

  const addToCartButton = () => (
    <button
      type="button"
      onClick={handleAddToCart}
      className="btn-festive inline-flex min-h-[2.5rem] flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold shadow-[0_4px_16px_rgba(234,88,12,0.3)]"
    >
      <ShoppingCart className="h-4 w-4" />
      Add to Cart
    </button>
  )

  const statusBadges = (
    <div className="flex flex-wrap gap-2">
      <ProductBrandBadge brand={product.brand} variant="overlay" />
      {product.is_available ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/35 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          In Stock
        </span>
      ) : (
        <span className="rounded-full border border-red-400/35 bg-red-500/20 px-2.5 py-1 text-[10px] font-bold uppercase text-red-200">
          Out of Stock
        </span>
      )}
      {hasDiscount && (
        <span className="rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
          {product.discount_percentage}% Off
        </span>
      )}
      {inCart && (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/85 bg-black/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-50 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          <ShoppingCart className="h-3 w-3 text-amber-200" aria-hidden="true" />
          In Cart · {cartQty}
        </span>
      )}
    </div>
  )

  const aboutSection = (tone: 'light' | 'dark' = 'light') =>
    product.description ? (
      <div
        className={cn(
          'overflow-hidden rounded-xl',
          tone === 'light'
            ? 'border border-navy-900/8 bg-white shadow-sm'
            : 'border border-white/10 bg-black/35 shadow-sm backdrop-blur-sm',
        )}
      >
        <div
          className={cn(
            'border-b px-3.5 py-2',
            tone === 'light' ? 'border-navy-900/8 bg-cream-50/80' : 'border-white/10 bg-white/5',
          )}
        >
          <h2
            className={cn(
              'text-[10px] font-bold uppercase tracking-[0.14em]',
              tone === 'light' ? 'text-festive-500' : 'text-gold-400',
            )}
          >
            About this product
          </h2>
        </div>
        <p
          className={cn(
            'px-3.5 py-2.5 text-xs leading-snug sm:py-3 sm:text-sm sm:leading-relaxed',
            tone === 'light' ? 'text-navy-700/80' : 'text-cream-100/80',
          )}
        >
          {product.description}
        </p>
              </div>
    ) : null

  const specsSection = (tone: 'light' | 'dark' = 'light') =>
    specs.length > 0 ? (
      <div
        className={cn(
          'overflow-hidden rounded-xl',
          tone === 'light'
            ? 'border border-navy-900/8 bg-white shadow-sm'
            : 'border border-white/10 bg-black/35 shadow-sm backdrop-blur-sm',
        )}
      >
        <div
          className={cn(
            'border-b px-3.5 py-2',
            tone === 'light' ? 'border-navy-900/8 bg-cream-50/80' : 'border-white/10 bg-white/5',
          )}
        >
          <h2
            className={cn(
              'text-[10px] font-bold uppercase tracking-[0.14em]',
              tone === 'light' ? 'text-festive-500' : 'text-gold-400',
            )}
          >
            Specifications
          </h2>
        </div>
        <dl className={cn('grid gap-px p-px sm:grid-cols-2', tone === 'light' ? 'bg-navy-900/5' : 'bg-white/5')}>
          {specs.map(([key, value]) => (
            <div
              key={key}
              className={cn('px-3 py-2 sm:px-3.5 sm:py-2.5', tone === 'light' ? 'bg-white' : 'bg-black/25')}
            >
              <dt
                className={cn(
                  'text-[9px] font-bold uppercase tracking-wide',
                  tone === 'light' ? 'text-navy-700/45' : 'text-cream-100/45',
                )}
              >
                {key}
              </dt>
              <dd
                className={cn(
                  'mt-0.5 text-xs font-semibold sm:text-sm',
                  tone === 'light' ? 'text-navy-900' : 'text-cream-50',
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    ) : null

  const addToCartPanel = (className?: string) =>
    product.is_available ? (
      <div
        className={cn(
          'rounded-lg border border-gold-500/25 bg-gradient-to-br from-navy-950 via-[#1a120e] to-navy-950 p-2.5 shadow-[0_8px_24px_rgba(12,8,6,0.2)] sm:p-3',
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-cream-50">
            {inCart ? 'Quantity in cart' : 'Add to enquiry cart'}
          </h2>
          {inCart && <span className="text-[10px] font-semibold text-emerald-300">In cart</span>}
        </div>
        {inCart ? (
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            min={0}
            variant="ember"
            className="w-full"
          />
        ) : (
          <div className="flex items-end gap-2">
            <div className="w-28 shrink-0">
              <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-gold-400/70">
                Qty
              </label>
              <QuantitySelector
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                variant="ember"
                compact
              />
            </div>
            {addToCartButton()}
          </div>
        )}
        <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-snug text-cream-100/50">
          <MessageCircle className="mt-0.5 h-3 w-3 shrink-0 text-gold-400/80" />
          Build your cart, then send one WhatsApp enquiry with your full order list.
        </p>
        </div>
    ) : (
      <div className={cn('rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2', className)}>
        <p className="text-xs font-semibold text-red-300">This product is currently out of stock.</p>
      </div>
    )

  return (
    <>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch lg:gap-6">
        {/* Left column — image + details */}
        <div className="mx-auto w-full max-w-md lg:mx-0 lg:flex lg:max-w-none lg:flex-col">
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-navy-950/75 shadow-[0_12px_40px_rgba(0,0,0,0.4)] ring-1 ring-gold-500/25 backdrop-blur-md sm:rounded-2xl">
            <ProductMediaCarousel
              product={product}
              priority
              perforationDotClass={getCardPerforationDotClass(product.tag)}
              perforationLineClass={getCardPerforationLineClass(product.tag)}
            >
              {hasDiscount && (
                <DiscountOfferTag
                  percentage={product.discount_percentage!}
                  variant={discountVariant}
                  className="z-20 w-10 pt-1.5 pb-3.5 sm:w-12 sm:pt-2 sm:pb-4 [&_span:first-child]:text-xs sm:[&_span:first-child]:text-sm"
                />
              )}

              <div className="absolute left-3 top-3 z-10 flex flex-col gap-2 sm:left-4 sm:top-4">
                <ProductHighlightBadges product={product} />
                {product.tag && <ProductTagBadge tag={product.tag} variant="overlay" />}
                <WishlistButton
                  product={product}
                  className="rounded-full bg-black/45 p-1.5 backdrop-blur-sm hover:bg-black/60"
                  size="sm"
                />
              </div>

              {product.brand && (
                <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-4 sm:bottom-4">
                  <ProductBrandBadge brand={product.brand} variant="overlay" className="max-w-full" />
                </div>
              )}
            </ProductMediaCarousel>

            {/* Mobile: name → price → cart, then details */}
            <div className="space-y-2 bg-navy-950/60 px-3 pb-3 pt-2.5 backdrop-blur-sm lg:hidden">
            {product.category && (
              <Link
                to={`/products?category=${product.category.id}`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-400/80 transition hover:text-gold-300"
              >
                <Sparkles className="h-3 w-3" />
                {product.category.name}
              </Link>
            )}

              <h1 className={cn(CARD_TITLE_BASE_CLASS, 'text-lg sm:text-xl', getCardTitleClass(product.tag))}>
                {product.name}
              </h1>

              {priceBlock}

              {statusBadges}
              {aboutSection('dark')}
              {specsSection('dark')}
            </div>

            {/* Desktop: price + add to cart below image */}
            <div className="hidden flex-col gap-2 bg-navy-950/60 px-3 pb-3 pt-2.5 backdrop-blur-sm lg:flex">
              {priceBlock}
              {addToCartPanel()}
            </div>
          </div>
                  </div>

        {/* Right column — desktop only */}
        <div className="hidden min-w-0 lg:flex lg:min-h-0 lg:flex-col">
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-navy-950/75 shadow-[0_12px_40px_rgba(0,0,0,0.4)] ring-1 ring-gold-500/25 backdrop-blur-md sm:rounded-2xl">
            <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
              {product.category && (
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300/90 transition hover:text-gold-200"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {product.category.name}
                </Link>
              )}

              <h1 className={cn(CARD_TITLE_BASE_CLASS, 'text-2xl xl:text-[1.75rem]', getCardTitleClass(product.tag))}>
                {product.name}
              </h1>

              {statusBadges}
            </div>

            <div className="flex flex-1 flex-col gap-3 border-t border-white/10 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
              {aboutSection('dark')}
              <div className="flex-1">{specsSection('dark')}</div>
              </div>
          </div>
            </div>
              </div>

      {/* Mobile: frozen add to cart bar */}
      {product.is_available && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-500/20 bg-navy-950/95 px-3 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <div className="mx-auto max-w-lg">
            {inCart ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/cart"
                  className="inline-flex min-h-[2.5rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-amber-300/80 bg-black/80 px-3 text-sm font-bold text-amber-50 shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition hover:bg-black/90"
                >
                  <ShoppingCart className="h-4 w-4 text-amber-200" />
                  Go to cart
                </Link>
                  <QuantitySelector
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={0}
                  variant="ember"
                    compact
                  className="w-[7.5rem] shrink-0"
                  />
                </div>
            ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                className="btn-festive inline-flex min-h-[2.75rem] w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold shadow-[0_4px_16px_rgba(234,88,12,0.3)]"
                >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
                </button>
          )}
        </div>
      </div>
      )}
    </>
  )
}
