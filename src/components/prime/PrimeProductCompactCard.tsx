import { memo } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Product } from '@/types/database'
import { cn, formatPrice, getImageUrl, IMAGE_WIDTH, truncate } from '@/lib/utils'
import { getDisplayBrand } from '@/lib/brand'
import { resolveProductPrice } from '@/lib/pricing'
import { useProductCartState } from '@/hooks/useProductCartState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductHighlightBadges } from '@/components/customer/ProductHighlightBadges'
import { ProductPackagingBadge } from '@/components/customer/ProductPackagingBadge'
import { ProductLink } from '@/components/customer/ProductLink'

function formatRsAmount(value: string | null): string {
  if (!value) return '—'
  return value.replace(/^₹\s?/, '').trim()
}

function PrimeCompactProductCardInner({
  product,
  priority = false,
}: {
  product: Product
  priority?: boolean
}) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const brand = getDisplayBrand(product.brand)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const available = product.is_available
  const sellingPrice = resolveProductPrice(product)
  const shownQty = inCart ? quantity : 0
  const lineTotal =
    sellingPrice != null && shownQty > 0 ? formatPrice(sellingPrice * shownQty) : formatPrice(0)

  return (
    <article
      className={cn(
        'group flex h-full flex-row items-stretch overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,77,85,0.06)] ring-1 ring-slate-200/90 transition duration-200 hover:shadow-[0_8px_24px_rgba(0,77,85,0.1)]',
        inCart && 'ring-2 ring-[#0077B6] shadow-[0_4px_16px_rgba(255,193,7,0.2)]',
      )}
    >
      <div className="relative w-[5.75rem] shrink-0 overflow-hidden bg-slate-50 sm:w-32 lg:w-[38%] lg:min-h-[7.5rem]">
        <ProductLink product={product} className="block h-full">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-full min-h-[5.75rem] w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:min-h-[8rem] lg:aspect-auto lg:min-h-[7.5rem]"
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </ProductLink>

        {hasDiscount && (
          <span className="absolute left-1 top-1 z-10 rounded-md bg-[#0077B6] px-1 py-0.5 text-[8px] font-extrabold text-white shadow-sm sm:left-2 sm:top-2 sm:px-1.5 sm:text-[9px] lg:hidden">
            {product.discount_percentage}% OFF
          </span>
        )}

        <div className="absolute bottom-2 left-2 z-10 max-w-[calc(100%-3rem)] lg:hidden">
          <ProductHighlightBadges product={product} compact />
        </div>

        <div className="absolute right-1 top-1 sm:right-2 sm:top-2 lg:hidden">
          <WishlistButton
            product={product}
            size="sm"
            className="h-6 w-6 rounded-full bg-white/95 shadow-md backdrop-blur-sm sm:h-7 sm:w-7"
          />
        </div>

        {!available && (
          <span className="absolute bottom-1 left-1 rounded-full bg-black/75 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white sm:bottom-2 sm:left-2 sm:px-2 sm:text-[9px]">
            Sold out
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 p-2.5 sm:p-3 lg:gap-2">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-1">
            <ProductLink product={product} className="min-w-0 flex-1">
              <h3 className="line-clamp-2 font-display text-[12px] font-bold leading-snug text-slate-900 sm:text-[13px]">
                {product.name}
              </h3>
            </ProductLink>
            <WishlistButton
              product={product}
              size="xs"
              className="hidden shrink-0 rounded-md bg-white lg:flex"
            />
          </div>

          {(brand || product.pieces != null || product.specifications?.sell_unit || product.is_recommended || product.is_best_seller) && (
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1 sm:gap-1.5">
              {brand && (
                <span className="min-w-0 truncate border-y border-[#0077B6]/80 px-0.5 text-[9px] font-bold text-[#0F2847] sm:border-none sm:px-0 sm:text-[10px] sm:font-semibold sm:text-[#0F2847]/70">
                  {brand}
                </span>
              )}
              <ProductPackagingBadge product={product} compact />
              <ProductHighlightBadges product={product} compact className="hidden lg:flex" />
            </div>
          )}

          {product.description?.trim() && (
            <p className="mt-1 hidden line-clamp-2 text-[11px] leading-relaxed text-slate-500 sm:block">
              {truncate(product.description, 80)}
            </p>
          )}

          <p className="mt-1.5 text-[12px] leading-none tabular-nums sm:mt-2 sm:text-[13px]">
            <span className="font-semibold text-slate-500">Rs.</span>{' '}
            {originalPrice ? (
              <span className="font-medium text-slate-400 line-through">{formatRsAmount(originalPrice)}</span>
            ) : (
              <span className="font-medium text-slate-400">—</span>
            )}
            <span className="mx-0.5 text-slate-400">/</span>
            <span className="font-bold text-[#0077B6]">{price ? formatRsAmount(price) : 'Enquire'}</span>
          </p>
        </div>

        {available || inCart ? (
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
            <div className="inline-flex h-8 overflow-hidden rounded-lg border border-[#0F2847]/15 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={!inCart}
                className="flex w-8 items-center justify-center border-r border-[#0F2847]/10 text-[#0F2847] transition hover:bg-[#0F2847]/5 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="flex min-w-[2rem] items-center justify-center border-r border-[#0F2847]/10 text-sm font-extrabold tabular-nums text-[#0F2847]">
                {shownQty}
              </span>
              <button
                type="button"
                onClick={inCart ? () => handleQuantityChange(quantity + 1) : handleAddToCart}
                className="flex w-8 items-center justify-center bg-[#0F2847] text-white transition hover:bg-[#1A3D66]"
                aria-label={inCart ? 'Increase quantity' : 'Add to cart'}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-sm font-extrabold tabular-nums text-[#0F2847]">{lineTotal}</p>
          </div>
        ) : (
          <p className="text-[11px] font-semibold text-slate-500 sm:text-xs">Sold out</p>
        )}
      </div>
    </article>
  )
}

export const PrimeProductCompactCard = memo(PrimeCompactProductCardInner)
