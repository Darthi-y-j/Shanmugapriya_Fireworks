import { memo, useEffect, useState } from 'react'
import { Eye, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'
import { getDisplayBrand } from '@/lib/brand'
import { useProductCartState } from '@/hooks/useProductCartState'
import { EmptyState } from '@/components/customer/EmptyState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductHighlightBadges } from '@/components/customer/ProductHighlightBadges'
import { ProductPackagingBadge } from '@/components/customer/ProductPackagingBadge'
import { ProductLink } from '@/components/customer/ProductLink'
import { PrimeCategoryHeader } from './PrimeCategoryHeader'

interface PrimeProductTableProps {
  groups: { id: string; name: string; products: Product[] }[]
  emptyTitle?: string
  showCategoryHeaders?: boolean
}

/**
 * Product grows; numeric columns stay compact so leftover width
 * is not split equally across columns.
 */
const COL_PRODUCT = 'min-w-0'
const COL_BRAND = 'min-w-0 text-left'
const COL_PRICE = 'text-center'
const COL_OFF = 'text-center'
const COL_STATUS = 'text-center'
const COL_ACTION = 'flex justify-end'

const DESKTOP_ROW =
  'hidden w-full grid-cols-[minmax(0,1fr)_7.5rem_6.5rem_3.75rem_6rem_15rem] items-start gap-x-2.5 border-b border-[#0077B6]/30 px-4 py-3.5 md:grid lg:grid-cols-[minmax(0,1fr)_9rem_7rem_4rem_6.5rem_17rem] lg:gap-x-3 lg:px-5 lg:py-4'

function PrimeTableHeader() {
  return (
    <div
      className={cn(
        DESKTOP_ROW,
        'border-b border-[#C9A24A]/40 bg-[#0F2847] font-display text-xs font-bold uppercase tracking-wide text-[#F5D78E] lg:text-[13px]',
      )}
    >
      <div className={COL_PRODUCT}>Product</div>
      <div className={COL_BRAND}>Brand</div>
      <div className={COL_PRICE}>Price</div>
      <div className={COL_OFF}>Off</div>
      <div className={COL_STATUS}>Availability</div>
      <div className={cn(COL_ACTION, 'text-right')}>Action</div>
    </div>
  )
}

function PrimeProductRow({ product, index }: { product: Product; index: number }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  const stripe = index % 2 === 0 ? 'bg-white' : 'bg-[#FFF8E1]/40'

  return (
    <>
      {/* Mobile — single compact row */}
      <div
        className={cn(
          'flex items-center gap-2 border-b border-slate-100 px-2 py-2 md:hidden',
          stripe,
          inCart && 'bg-[#0F2847]/8',
        )}
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 border-[#0077B6]">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute left-0 top-0 rounded-br bg-[#0077B6] px-0.5 py-px text-[7px] font-extrabold leading-none text-white">
              {product.discount_percentage}%
            </span>
          )}
          <ProductLink
            product={product}
            className="absolute bottom-0 inset-x-0 flex items-center justify-center bg-[#0F2847]/90 py-px text-[7px] font-bold text-white"
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-2 w-2" />
          </ProductLink>
        </div>

        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xs font-bold leading-tight text-[#0F2847]">
              {product.name}
            </p>
            <div className="mt-0.5 text-[10px] leading-snug">
              <ProductPackagingBadge product={product} compact className="whitespace-normal" />
            </div>
            <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1 text-[10px] leading-none">
              <ProductHighlightBadges product={product} compact className="mb-0.5" />
              {product.brand && (
                <span className="min-w-0 truncate font-semibold text-[#0F2847]/75">
                  {getDisplayBrand(product.brand)}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right leading-tight tabular-nums">
            {originalPrice && (
              <span className="block text-[10px] font-medium text-slate-400 line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-[13px] font-extrabold text-[#0077B6]">{price ?? 'Enquire'}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-px">
          <WishlistButton
            product={product}
            size="xs"
            className="shrink-0 rounded bg-white"
          />
          <PrimeMobileRowAction
            inCart={inCart}
            quantity={quantity}
            available={product.is_available}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onAdd={handleAddToCart}
          />
        </div>
      </div>

      {/* Desktop */}
      <div
        className={cn(
          DESKTOP_ROW,
          'border-slate-100 font-normal normal-case tracking-normal',
          stripe,
          inCart && 'bg-[#0F2847]/8',
        )}
      >
        <div className={cn(COL_PRODUCT, 'flex min-w-0 items-start gap-3 py-0.5')}>
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-16 w-16 shrink-0 rounded-md border-2 border-[#0077B6] object-cover lg:h-[4.5rem] lg:w-[4.5rem]"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-snug text-slate-900 lg:text-[15px]">
              {product.name}
            </p>
            <div className="mt-1">
              <ProductPackagingBadge product={product} compact className="max-w-full whitespace-normal" />
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1">
              <ProductHighlightBadges product={product} compact />
            </div>
          </div>
        </div>

        <div className={cn(COL_BRAND, 'pt-4')}>
          <PrimeBrandLabel brand={getDisplayBrand(product.brand)} />
        </div>

        <div className={cn(COL_PRICE, 'pt-4')}>
          <PrimePriceCell price={price} originalPrice={originalPrice} stacked />
        </div>

        <div className={cn(COL_OFF, 'pt-4')}>
          <PrimeOfferLabel percent={hasDiscount ? product.discount_percentage : null} />
        </div>

        <div className={cn(COL_STATUS, 'pt-4')}>
          <PrimeAvailability available={product.is_available} />
        </div>

        <div className={cn(COL_ACTION, 'items-center gap-1.5 pt-3')}>
          <ProductLink
            product={product}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#0F2847]/20 bg-white px-2.5 text-xs font-semibold text-[#0F2847] hover:bg-[#0F2847] hover:text-white"
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </ProductLink>
          <WishlistButton
            product={product}
            size="sm"
            className="h-9 w-9 shrink-0 rounded-md bg-white"
          />
          <PrimeRowAction
            inCart={inCart}
            quantity={quantity}
            available={product.is_available}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onAdd={handleAddToCart}
          />
        </div>
      </div>
    </>
  )
}

function PrimePriceCell({
  price,
  originalPrice,
  stacked,
}: {
  price: string | null
  originalPrice: string | null
  stacked?: boolean
}) {
  if (!price && !originalPrice) {
    return <span className="text-base font-extrabold text-[#0077B6]">Enquire</span>
  }

  if (stacked) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        {originalPrice && (
          <span className="text-sm font-medium tabular-nums text-slate-400 line-through">{originalPrice}</span>
        )}
        <span className="text-base font-extrabold tabular-nums text-[#0077B6] lg:text-lg">
          {price ?? 'Enquire'}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {originalPrice && (
        <span className="text-sm text-slate-400 line-through">{originalPrice}</span>
      )}
      <span className="text-base font-extrabold tabular-nums text-[#0077B6]">{price ?? 'Enquire'}</span>
    </div>
  )
}

function PrimeOfferLabel({
  percent,
  showOff = false,
}: {
  percent: number | null | undefined
  showOff?: boolean
}) {
  if (percent == null || percent <= 0) {
    return <span className="text-sm text-slate-400">—</span>
  }

  return (
    <span className="inline-flex max-w-full items-center justify-center rounded-md bg-[#0077B6] px-2.5 py-1 text-xs font-extrabold tabular-nums tracking-wide text-white shadow-sm">
      {percent}%{showOff ? ' OFF' : ''}
    </span>
  )
}

function PrimeBrandLabel({ brand }: { brand: string | null }) {
  if (!brand) {
    return <span className="text-sm text-slate-400">—</span>
  }

  return (
    <span className="inline-block max-w-full truncate border-y border-[#0077B6]/90 px-1 py-0.5 text-xs font-semibold leading-snug text-[#0F2847] lg:text-sm">
      {brand}
    </span>
  )
}

function PrimeAvailability({ available }: { available: boolean }) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        In stock
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
      Sold out
    </span>
  )
}

function PrimeMobileRowAction({
  inCart,
  quantity,
  available,
  onDecrease,
  onIncrease,
  onAdd,
}: {
  inCart: boolean
  quantity: number
  available: boolean
  onDecrease: () => void
  onIncrease: () => void
  onAdd: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const shownQty = inCart ? quantity : 0

  useEffect(() => {
    if (!inCart) setExpanded(false)
  }, [inCart])

  if (!available && !inCart) {
    return (
      <span className="inline-flex h-7 items-center rounded bg-slate-100 px-1 text-[9px] font-semibold text-slate-500">
        Sold out
      </span>
    )
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => {
          setExpanded(true)
          if (!inCart) onAdd()
        }}
        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#0F2847] text-white shadow-sm"
        aria-label={inCart ? 'Adjust quantity' : 'Add to cart'}
      >
        <ShoppingCart className="h-3.5 w-3.5" />
        {inCart && shownQty > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full bg-[#0077B6] px-0.5 text-[8px] font-bold leading-none text-white ring-1 ring-white">
            {shownQty}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="inline-flex h-7 overflow-hidden rounded border border-[#0F2847]/20 bg-white">
      <button
        type="button"
        onClick={() => {
          onDecrease()
          if (quantity <= 1) setExpanded(false)
        }}
        disabled={!inCart}
        className="flex w-6 items-center justify-center text-[#0F2847] hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="flex min-w-[1.125rem] items-center justify-center border-x border-[#0F2847]/15 text-[10px] font-bold tabular-nums text-[#1A1A1A]">
        {shownQty}
      </span>
      <button
        type="button"
        onClick={inCart ? onIncrease : onAdd}
        className="flex w-6 items-center justify-center bg-[#0F2847] text-white hover:bg-[#1A3D66]"
        aria-label={inCart ? 'Increase quantity' : 'Add to cart'}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}

function PrimeRowAction({
  compact,
  inCart,
  quantity,
  available,
  onDecrease,
  onIncrease,
  onAdd,
}: {
  compact?: boolean
  inCart: boolean
  quantity: number
  available: boolean
  onDecrease: () => void
  onIncrease: () => void
  onAdd: () => void
}) {
  const shownQty = inCart ? quantity : 0

  if (!available && !inCart) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded bg-slate-100 font-semibold text-slate-500',
          compact ? 'h-7 px-1 text-[9px]' : 'h-9 px-2.5 text-xs',
        )}
      >
        Sold out
      </span>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex overflow-hidden rounded border border-[#0F2847]/20 bg-white',
        compact ? 'h-7' : 'h-9',
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={!inCart}
        className={cn(
          'flex items-center justify-center text-[#0F2847] hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300',
          compact ? 'w-6' : 'w-9',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
      <span
        className={cn(
          'flex items-center justify-center border-x border-[#0F2847]/15 font-bold tabular-nums text-[#1A1A1A]',
          compact ? 'min-w-[1.125rem] text-[10px]' : 'min-w-[2rem] text-sm',
        )}
      >
        {shownQty}
      </span>
      <button
        type="button"
        onClick={inCart ? onIncrease : onAdd}
        className={cn(
          'flex items-center justify-center bg-[#0F2847] text-white hover:bg-[#1A3D66]',
          compact ? 'w-6' : 'w-9',
        )}
        aria-label={inCart ? 'Increase quantity' : 'Add to cart'}
      >
        {inCart ? (
          <Plus className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        ) : (
          <ShoppingCart className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        )}
      </button>
    </div>
  )
}

const PrimeProductRowMemo = memo(PrimeProductRow)

export function PrimeProductTable({
  groups,
  emptyTitle = 'No products found',
  showCategoryHeaders = true,
}: PrimeProductTableProps) {
  const totalProducts = groups.reduce((n, g) => n + g.products.length, 0)

  if (totalProducts === 0) {
    return (
      <EmptyState title={emptyTitle} description="Try a different category or search term." />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-[#0F2847]/15 bg-white shadow-md">
      {groups.map((group, groupIndex) => (
        <section key={group.id} id={`category-${group.id}`} className="scroll-mt-44">
          {showCategoryHeaders && <PrimeCategoryHeader name={group.name} />}

          {(showCategoryHeaders || groupIndex === 0) && <PrimeTableHeader />}

          {group.products.map((product, index) => (
            <PrimeProductRowMemo key={product.id} product={product} index={index} />
          ))}
        </section>
      ))}
    </div>
  )
}
