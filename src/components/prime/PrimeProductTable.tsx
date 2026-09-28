import { memo } from 'react'
import { Eye, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'
import { getDisplayBrand } from '@/lib/brand'
import { getProductCode } from '@/lib/productCode'
import { useProductCartState } from '@/hooks/useProductCartState'
import { EmptyState } from '@/components/customer/EmptyState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductHighlightBadges } from '@/components/customer/ProductHighlightBadges'
import { formatProductPackagingLabel } from '@/lib/packaging'
import { ProductLink } from '@/components/customer/ProductLink'
import { PrimeCategoryHeader } from './PrimeCategoryHeader'

interface PrimeProductTableProps {
  groups: { id: string; name: string; products: Product[] }[]
  emptyTitle?: string
  showCategoryHeaders?: boolean
}

/** Mobile: Code | Product | Like | Price | Cart */
const MOBILE_GRID =
  'grid w-full grid-cols-[1.5rem_minmax(0,1fr)_1.65rem_2.75rem_4.25rem] items-center gap-x-1 px-1 md:hidden'

const MOBILE_ROW = cn(MOBILE_GRID, 'border-b border-slate-200/80 py-1.5')

const MOBILE_HEADER = cn(
  MOBILE_GRID,
  'border-b border-[#C9A24A]/50 bg-[#0F2847] py-1.5 font-display text-[10px] font-bold uppercase tracking-wider text-[#F5D78E]',
)

/** Desktop: full shop table */
const DESKTOP_ROW =
  'hidden w-full grid-cols-[2.75rem_minmax(0,1fr)_7.5rem_6.5rem_3.75rem_6rem_15rem] items-start gap-x-2.5 border-b border-[#0077B6]/30 px-4 py-3.5 md:grid lg:grid-cols-[3rem_minmax(0,1fr)_9rem_7rem_4rem_6.5rem_17rem] lg:gap-x-3 lg:px-5 lg:py-4'

const DESKTOP_HEADER =
  'hidden border-b border-[#C9A24A]/40 bg-[#0F2847] font-display text-xs font-bold uppercase tracking-wide text-[#F5D78E] md:grid lg:text-[13px]'

const COL_CODE = 'text-center tabular-nums'
const COL_PRODUCT = 'min-w-0'
const COL_BRAND = 'min-w-0 text-left'
const COL_PRICE = 'text-center'
const COL_OFF = 'text-center'
const COL_STATUS = 'text-center'

function PrimeTableHeader() {
  return (
    <>
      <div className={MOBILE_HEADER}>
        <div className={cn(COL_CODE, 'text-[9px] leading-tight')}>Code</div>
        <div className="min-w-0 pl-5 text-center">Product</div>
        <div className="text-center" aria-hidden="true">♥</div>
        <div className="text-center">Price</div>
        <div className="text-center">Add</div>
      </div>
      <div className={cn(DESKTOP_ROW, DESKTOP_HEADER, 'items-center py-2.5')}>
        <div className={COL_CODE}>Code</div>
        <div className={COL_PRODUCT}>Product</div>
        <div className={COL_BRAND}>Brand</div>
        <div className={COL_PRICE}>Price</div>
        <div className={COL_OFF}>Off</div>
        <div className={COL_STATUS}>Availability</div>
        <div className="text-right">Action</div>
      </div>
    </>
  )
}

function MobilePriceCell({
  price,
  originalPrice,
}: {
  price: string | null
  originalPrice: string | null
}) {
  return (
    <div className="flex min-w-0 flex-col items-center leading-none tabular-nums">
      <span className="text-[11px] font-extrabold text-[#0077B6]">{price ?? '—'}</span>
      {originalPrice && (
        <span className="mt-0.5 text-[9px] font-medium text-slate-400 line-through">
          {originalPrice}
        </span>
      )}
    </div>
  )
}

function MobileProductMeta({ product }: { product: Product }) {
  const brand = getDisplayBrand(product.brand)
  const pack = formatProductPackagingLabel(product)
  const meta = [brand, pack].filter(Boolean).join(' • ')
  if (!meta) return null
  return <p className="mt-px truncate text-[9px] font-medium leading-tight text-slate-500">{meta}</p>
}

function MobileAddCell({
  product,
  inCart,
  quantity,
  onDecrease,
  onIncrease,
  onAdd,
}: {
  product: Product
  inCart: boolean
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  onAdd: () => void
}) {
  const available = product.is_available

  if (!available && !inCart) {
    return <span className="text-center text-[8px] font-semibold text-slate-400">—</span>
  }

  if (inCart) {
    return (
      <div
        className="box-border flex h-8 w-full min-w-0 max-w-full items-stretch overflow-hidden rounded-lg border border-[#C9A24A] bg-white shadow-sm"
        role="group"
        aria-label="Quantity in cart"
      >
        <button
          type="button"
          onClick={onDecrease}
          className="flex min-w-[1.35rem] flex-1 items-center justify-center text-[#0F2847] hover:bg-slate-50 active:bg-slate-100"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        </button>
        <span
          className="flex w-6 shrink-0 items-center justify-center border-x border-[#C9A24A]/40 text-[11px] font-bold tabular-nums text-[#0F2847]"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="flex min-w-[1.35rem] flex-1 items-center justify-center bg-[#0F2847] text-[#F5D78E] hover:bg-[#1A3D66] active:bg-[#0F2847]"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      className="mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#C9A24A]/60 bg-[#F5D78E] text-[#0F2847] shadow-sm hover:bg-[#C9A24A]"
      aria-label="Add to cart"
    >
      <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.25} />
    </button>
  )
}

function PrimeProductRow({ product, index }: { product: Product; index: number }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  const stripe = index % 2 === 0 ? 'bg-white' : 'bg-[#FFF8E1]/40'

  const brand = getDisplayBrand(product.brand)
  const packagingLabel = formatProductPackagingLabel(product)

  return (
    <>
      {/* Mobile — Aura-style 4-column list (fits screen, no swipe) */}
      <div className={cn(MOBILE_ROW, stripe, inCart && 'bg-[#0077B6]/[0.06]')}>
        <div className="text-center text-[11px] font-extrabold tabular-nums text-slate-800">
          {getProductCode(product)}
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          <ProductLink
            product={product}
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-slate-200/90"
          >
            <img
              src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.table)}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </ProductLink>
          <div className="min-w-0 flex-1">
            <ProductLink
              product={product}
              className="line-clamp-1 text-[11px] font-bold leading-tight text-slate-900"
            >
              {product.name}
            </ProductLink>
            <MobileProductMeta product={product} />
          </div>
        </div>

        <div className="flex justify-center">
          <WishlistButton
            product={product}
            size="xs"
            className="h-7 w-7 shrink-0 rounded-full border border-slate-200/90 bg-white p-0 shadow-none"
          />
        </div>

        <MobilePriceCell price={price} originalPrice={originalPrice} />

        <div className="min-w-0 w-full">
          <MobileAddCell
            product={product}
            inCart={inCart}
            quantity={quantity}
            onDecrease={() => handleQuantityChange(quantity - 1)}
            onIncrease={() => handleQuantityChange(quantity + 1)}
            onAdd={handleAddToCart}
          />
        </div>
      </div>

      {/* Desktop — full columns */}
      <div
        className={cn(
          DESKTOP_ROW,
          'font-normal normal-case tracking-normal text-sm',
          stripe,
          inCart && 'bg-[#0F2847]/8',
        )}
      >
        <div className={cn(COL_CODE, 'pt-4 text-sm font-bold text-[#0F2847]')}>
          {getProductCode(product)}
        </div>

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
            {packagingLabel ? (
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-[#0077B6] lg:text-xs">
                {packagingLabel}
              </p>
            ) : null}
            <div className="mt-0.5 flex flex-wrap items-center gap-1">
              <ProductHighlightBadges product={product} compact />
            </div>
          </div>
        </div>

        <div className={cn(COL_BRAND, 'pt-4')}>
          <PrimeBrandLabel brand={brand} />
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

        <div className="flex items-center justify-end gap-1.5 pt-3">
          <ProductLink
            product={product}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-[#0F2847]/20 bg-white px-2.5 text-xs font-semibold text-[#0F2847] hover:bg-[#0F2847] hover:text-white"
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </ProductLink>
          <WishlistButton product={product} size="sm" className="h-9 w-9 shrink-0 rounded-md bg-white" />
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
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 lg:gap-1.5 lg:px-2.5 lg:py-1 lg:text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 lg:h-2 lg:w-2" aria-hidden="true" />
        <span className="hidden lg:inline">In stock</span>
        <span className="lg:hidden">Yes</span>
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 lg:px-2.5 lg:py-1 lg:text-xs">
      No
    </span>
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
    <div className="overflow-x-clip overflow-y-visible rounded-xl border-2 border-[#0F2847]/15 bg-white shadow-md max-md:overflow-x-visible md:overflow-x-auto">
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
