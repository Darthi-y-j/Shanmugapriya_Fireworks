import { memo } from 'react'
import { ProductLink } from './ProductLink'
import { Eye, ShoppingCart, Check, ArrowRight, Sparkles } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, truncate, cn } from '@/lib/utils'
import { isEliteProductTag, SILVER_METALLIC_BG, ELITE_BORDER_GLOW, ELITE_CARD_INNER, FEATURED_CARD_GRADIENT, getCardDescriptionClass, getCardCategoryClass, getCardTitleClass, CARD_TITLE_BASE_CLASS, getCardPricePanelClass, getCardViewButtonClass, getCardPerforationDotClass, getCardPerforationLineClass } from '@/lib/productCardThemes'
import { useProductCartState } from '@/hooks/useProductCartState'
import { QuantitySelector } from './QuantitySelector'
import { CartQuantityControl } from './CartQuantityControl'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { DiscountOfferTag } from './DiscountOfferTag'
import { CatalogueProductCard } from './CatalogueProductCard'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'
import { WishlistButton } from './WishlistButton'
import { ProductHighlightBadges } from './ProductHighlightBadges'
import { isCardVisibleProductTag } from '@/lib/productTags'
import { isPriorityProductIndex } from './ProductImage'

interface ProductCardProps {
  product: Product
  index?: number
  variant?: 'default' | 'featured' | 'featured-hero' | 'catalogue'
  /** Stretch to fill grid cell height (featured showcase bento layout) */
  fillHeight?: boolean
  /** Smaller featured card for hero marquee */
  compact?: boolean
  /** Show one-tap add-to-cart on compact featured cards */
  showQuickAdd?: boolean
}

function ProductMetaBadges({
  product,
  inCart,
  className,
  showInCart = false,
}: {
  product: Product
  inCart: boolean
  className?: string
  showInCart?: boolean
}) {
  if (!(showInCart && inCart) && product.is_available) return null

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showInCart && inCart && (
        <span className="text-[9px] font-semibold uppercase tracking-wider text-gold-400/80">
          In cart
        </span>
      )}
      {!product.is_available && (
        <span className="text-[9px] font-semibold uppercase tracking-wider text-red-400/90">
          Out of stock
        </span>
      )}
    </div>
  )
}

function PriceBlock({
  price,
  originalPrice,
  size = 'default',
  inverted = false,
  theme = 'light',
}: {
  price: string | null
  originalPrice: string | null
  size?: 'default' | 'large'
  inverted?: boolean
  theme?: 'light' | 'dark' | 'ember' | 'silver' | 'elite'
}) {
  const isDark = theme === 'dark' || theme === 'ember' || theme === 'silver' || theme === 'elite' || inverted

  if (!price) {
    return (
      <span
        className={cn(
          'text-sm font-semibold',
          isDark
            ? theme === 'elite'
              ? 'text-cyan-300/90'
              : theme === 'silver'
                ? 'text-slate-300'
                : 'text-gold-400'
            : 'text-festive-600'
        )}
      >
        Enquire for price
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex items-baseline gap-2',
        theme === 'ember' || theme === 'silver' || theme === 'elite' ? 'flex-col gap-0.5 sm:flex-row sm:flex-wrap' : 'flex-wrap',
      )}
    >
      {originalPrice && (
        <span
          className={cn(
            'shrink-0 line-through tabular-nums',
            theme === 'ember' || theme === 'silver' || theme === 'elite'
              ? cn(
                  'text-[11px] leading-none sm:text-sm',
                  theme === 'elite' ? 'text-cyan-300/55' : 'text-white/55',
                )
              : isDark
                ? 'text-cream-100/45'
                : 'text-navy-700/50',
            theme !== 'ember' && theme !== 'silver' && theme !== 'elite' && (size === 'large' ? 'text-base' : 'text-sm'),
          )}
        >
          {originalPrice}
        </span>
      )}
      <span
        className={cn(
          'font-bold tabular-nums',
          theme === 'ember'
            ? 'text-base text-gold-300 sm:text-xl'
            : theme === 'elite'
              ? 'text-base bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-200 bg-clip-text text-transparent sm:text-xl'
              : theme === 'silver'
                ? 'text-base text-slate-100 sm:text-xl'
            : isDark
              ? 'text-gold-300'
              : 'text-navy-900',
          size === 'large' ? 'text-2xl sm:text-3xl' : theme !== 'ember' && theme !== 'silver' && theme !== 'elite' && 'text-xl',
        )}
      >
        {price}
      </span>
    </div>
  )
}

export const ProductCard = memo(function ProductCard({
  product,
  index = 0,
  variant = 'default',
  fillHeight = false,
  compact = false,
  showQuickAdd = false,
}: ProductCardProps) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const isElite = isEliteProductTag(product.tag)
  const showCategory = product.category && !isCardVisibleProductTag(product.tag)
  const hasProductImage = Boolean(product.image_url?.trim())
  const priorityImage =
    variant === 'featured' || variant === 'featured-hero' || isPriorityProductIndex(index)

  if (variant === 'catalogue') {
    return <CatalogueProductCard product={product} index={index} />
  }

  if (variant === 'featured-hero') {
    return (
      <article
        className={cn(
          'product-grid-item group relative overflow-hidden rounded-xl border border-gold-500/15 bg-white shadow-[0_20px_60px_rgba(46,30,22,0.12)] transition-all duration-500 hover:border-gold-400/30 hover:shadow-[0_28px_70px_rgba(46,30,22,0.16)] sm:rounded-2xl',
          fillHeight && 'flex h-full flex-col',
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-400/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

        <div className={cn('flex flex-col lg:flex-row', fillHeight && 'flex-1 lg:min-h-0')}>
          <ProductLink
            product={product}
            className={cn(
              'relative overflow-hidden bg-navy-900/5',
              fillHeight
                ? 'aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-0 lg:w-[48%]'
                : 'aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[340px] lg:w-[52%]',
            )}
          >
            <img
              src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
              alt={product.name}
              loading={priorityImage ? 'eager' : 'lazy'}
              decoding={priorityImage ? 'sync' : 'async'}
              fetchPriority={priorityImage ? 'high' : 'auto'}
              className="image-zoom h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy-950/20" />
            <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
              <WishlistButton
                product={product}
                className="rounded-full bg-navy-950/60 backdrop-blur-sm hover:bg-navy-950/80"
                size="sm"
              />
            </div>
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2">
              <ProductHighlightBadges product={product} />
              {product.tag ? (
                <ProductTagBadge tag={product.tag} variant="overlay" />
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/30 bg-navy-950/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-gold-300 backdrop-blur-md sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.12em]">
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  Top Pick
                </span>
              )}
            </div>
          </ProductLink>

          <div className="flex flex-1 flex-col justify-center p-4 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-gold-500 sm:text-[10px] sm:tracking-[0.14em]">
                  {product.category.name}
                </span>
              )}
              <ProductBrandBadge brand={product.brand} variant="light" />
              <ProductTagBadge tag={product.tag} variant="light" />
              <ProductMetaBadges product={product} inCart={inCart} />
            </div>
            <ProductLink product={product}>
              <h3 className="mt-1.5 font-product-name text-lg font-bold leading-tight text-navy-900 transition-colors group-hover:text-festive-500 sm:mt-2 sm:text-2xl lg:text-3xl">
                {product.name}
              </h3>
            </ProductLink>
            {product.description && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy-700/70 sm:mt-3 sm:line-clamp-3 sm:text-sm">
                {truncate(product.description, 140)}
              </p>
            )}

            <div className="mt-4 sm:mt-6">
              <PriceBlock price={price} originalPrice={originalPrice} size="large" />
            </div>

            {product.is_available && (
              <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] font-medium text-navy-700/60 sm:text-xs">Quantity</span>
                  <QuantitySelector value={quantity} onChange={handleQuantityChange} />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <ProductLink
                    product={product}
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy-800/15 px-3.5 py-2 text-xs font-semibold text-navy-900 transition-all hover:border-gold-500/30 hover:bg-cream-50 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    View Details
                  </ProductLink>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-festive inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
                  >
                    {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                    {inCart ? 'Update Cart' : 'Add to Cart'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'featured') {
    return (
      <article
        className={cn(
          'product-grid-item group relative flex flex-col overflow-hidden rounded-lg border border-gold-500/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-gold-400/30 sm:rounded-xl',
          FEATURED_CARD_GRADIENT,
          !fillHeight && !compact && 'hover:-translate-y-1',
        )}
      >
        <ProductLink
          product={product}
          className={cn(
            'relative overflow-hidden bg-[#140f0d]',
            fillHeight
              ? 'block min-h-[140px] flex-1'
              : compact
                ? 'block aspect-[4/3]'
                : 'block aspect-[4/3] sm:aspect-[5/4]',
          )}
        >
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
            alt={product.name}
            loading={priorityImage ? 'eager' : 'lazy'}
            decoding={priorityImage ? 'sync' : 'async'}
            fetchPriority={priorityImage ? 'high' : 'auto'}
            className={cn(
              'image-zoom object-cover',
              fillHeight ? 'absolute inset-0 h-full w-full' : 'h-full w-full',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140f0d]/75 via-[#43302b]/15 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

          {product.discount_percentage != null && product.discount_percentage > 0 && (
            <DiscountOfferTag
              percentage={product.discount_percentage}
              className={compact ? 'scale-[0.78] origin-top-right' : undefined}
            />
          )}

          <div
            className={cn(
              'absolute left-2 top-2 z-20 flex flex-col items-start gap-1',
              !compact && 'gap-1.5 sm:left-3 sm:top-3',
            )}
          >
            {(compact && showQuickAdd) || !compact ? (
              <ProductHighlightBadges product={product} compact={compact} />
            ) : null}
            {product.tag && !compact ? (
              <ProductTagBadge tag={product.tag} variant="overlay" compact />
            ) : null}
            {!compact && (
              <WishlistButton
                product={product}
                className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/55"
                size="sm"
              />
            )}
          </div>

          <div className={cn('absolute inset-x-0 bottom-0', compact ? 'p-2' : 'p-3 sm:p-4')}>
            {(product.category || product.brand) && !compact && (
              <div className="flex min-w-0 items-center justify-between gap-2">
                {product.category ? (
                  <span className="min-w-0 flex-1 truncate text-[9px] font-bold uppercase tracking-[0.1em] text-gold-300 sm:text-[10px] sm:tracking-[0.12em]">
                    {product.category.name}
                  </span>
                ) : (
                  <span className="flex-1" aria-hidden="true" />
                )}
                {product.brand && (
                  <ProductBrandBadge
                    brand={product.brand}
                    variant="overlay"
                    className="max-w-[52%] shrink-0"
                  />
                )}
              </div>
            )}
            <h3
              className={cn(
                'font-product-name line-clamp-2 font-extrabold leading-tight tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]',
                compact ? 'text-[11px]' : 'text-sm sm:text-base',
                (product.category || product.brand) && !compact && 'mt-0.5 sm:mt-1',
              )}
            >
              {product.name}
            </h3>
            {!compact && (
              <div className="mt-2">
                <PriceBlock price={price} originalPrice={originalPrice} inverted />
              </div>
            )}
          </div>
        </ProductLink>

        {compact && showQuickAdd && product.is_available && (
          <div className="border-t border-gold-500/15 p-1.5">
            {inCart ? (
              <CartQuantityControl
                value={quantity}
                onChange={handleQuantityChange}
                variant="ember"
                min={0}
                className="w-full"
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 py-1.5 text-[10px] font-bold text-white shadow-[0_2px_10px_rgba(234,88,12,0.35)] transition-transform active:scale-95"
              >
                <ShoppingCart className="h-3 w-3" />
                Add to cart
              </button>
            )}
          </div>
        )}

        {product.is_available && !compact && (
          <div className="flex shrink-0 gap-2 border-t border-gold-500/15 p-3">
            <ProductLink
              product={product}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-xs font-semibold transition-colors',
                getCardViewButtonClass(product.tag),
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </ProductLink>
            {inCart ? (
              <CartQuantityControl
                value={quantity}
                onChange={handleQuantityChange}
                variant={isElite ? 'elite' : 'ember'}
                min={0}
                className="min-w-0 flex-1"
              />
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-festive-500 to-gold-500 py-2 text-xs font-bold text-white transition-transform active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            )}
          </div>
        )}
      </article>
    )
  }

  return (
    <article
      className={cn(
        'product-ember-card product-grid-item group relative flex h-full flex-col overflow-hidden rounded-xl transition-[transform,box-shadow] duration-300 sm:rounded-[1.35rem] sm:hover:-translate-y-1',
        isElite && 'product-elite-card',
      )}
    >
      {/* Gradient border glow */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-xl opacity-70 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-[1.35rem]',
          isElite
            ? ELITE_BORDER_GLOW
            : 'bg-gradient-to-br from-gold-400/50 via-festive-500/30 to-gold-600/40',
        )}
        aria-hidden="true"
      />
      <div className={cn('relative flex flex-1 flex-col overflow-hidden rounded-[calc(1rem-1px)] sm:rounded-[1.32rem]', isElite ? ELITE_CARD_INNER : 'bg-navy-950')}>
        {/* Image stage */}
        <ProductLink product={product} className="relative block shrink-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1f1410] sm:aspect-[4/3.2]">
            <img
              src={getImageUrl(product.image_url, '/placeholder-product-dark.svg', IMAGE_WIDTH.card)}
              alt={product.name}
              loading={priorityImage ? 'eager' : 'lazy'}
              decoding={priorityImage ? 'sync' : 'async'}
              fetchPriority={priorityImage ? 'high' : 'auto'}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
            />
            {hasProductImage && (
            <div className={cn(
              'absolute inset-0',
              isElite
                ? 'bg-gradient-to-t from-navy-950 via-indigo-950/25 to-navy-950/30'
                : 'bg-gradient-to-t from-navy-950 via-transparent to-navy-950/20',
            )} />
            )}

            {product.discount_percentage != null && product.discount_percentage > 0 && (
              <DiscountOfferTag
                percentage={product.discount_percentage}
                variant={isElite ? 'elite' : 'festive'}
                className="w-8 pt-1.5 pb-2.5 sm:w-[42px] sm:pt-2 sm:pb-3.5 [&_span:first-child]:text-[10px] sm:[&_span:first-child]:text-[13px]"
              />
            )}

            <div className="absolute left-2 top-2 z-20 flex flex-col items-start gap-1.5 sm:left-2.5 sm:top-2.5">
              <ProductHighlightBadges product={product} />
              {product.tag && (
                <ProductTagBadge tag={product.tag} variant="overlay" compact />
              )}
              <WishlistButton
                product={product}
                className="rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/55"
                size="sm"
              />
            </div>

            {product.brand && (
              <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-2.5 sm:bottom-2.5">
                <ProductBrandBadge
                  brand={product.brand}
                  variant={isElite ? 'elite' : 'overlay'}
                  className={cn(
                    'max-w-full',
                    isElite &&
                      'border-slate-300/50 bg-navy-950/85 text-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur-md',
                  )}
                />
              </div>
            )}
          </div>

          {/* Ticket perforation — desktop only */}
          <div className="relative hidden items-center bg-navy-950 px-3 py-1 sm:flex" aria-hidden="true">
            <div className={cn('h-3 w-3 -translate-x-1/2 rounded-full', getCardPerforationDotClass(product.tag))} />
            <div className={cn('mx-2 flex-1 border-t border-dashed', getCardPerforationLineClass(product.tag))} />
            <div className={cn('h-3 w-3 translate-x-1/2 rounded-full', getCardPerforationDotClass(product.tag))} />
          </div>
        </ProductLink>

        {/* Dark content panel */}
        <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3.5 sm:pb-3.5 sm:pt-2.5">
          <ProductLink product={product} className="block">
            <h3
              className={cn(
                CARD_TITLE_BASE_CLASS,
                getCardTitleClass(product.tag),
              )}
            >
              {product.name}
            </h3>
          </ProductLink>

          {showCategory && (
            <span
              className={cn(
                'mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] sm:text-[9px] sm:tracking-[0.16em]',
                getCardCategoryClass(product.tag),
              )}
            >
              {product.category!.name}
            </span>
          )}

          {product.description && (
            <p className={cn('mt-1.5 hidden line-clamp-2 text-[11px] leading-relaxed sm:block', getCardDescriptionClass(product.tag))}>
              {truncate(product.description, 80)}
            </p>
          )}

          <div
            className={cn(
              'mt-1.5 flex items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 ring-1 ring-inset sm:mt-2.5 sm:gap-2 sm:px-2.5 sm:py-2',
              getCardPricePanelClass(product.tag),
            )}
          >
            <div className="min-w-0">
              <PriceBlock
                price={price}
                originalPrice={originalPrice}
                theme={isElite ? 'elite' : 'ember'}
              />
            </div>
            <ProductPiecesBadge
              product={product}
              variant={isElite ? 'elite' : 'ember'}
              className="shrink-0 text-[8px] sm:text-[9px]"
            />
          </div>

          {product.is_available ? (
            <div className="mt-auto pt-2 sm:mt-2.5 sm:pt-0">
              {/* Mobile — single compact action */}
              <div className="sm:hidden">
                {inCart ? (
                  <CartQuantityControl
                    value={quantity}
                    onChange={handleQuantityChange}
                    variant={isElite ? 'elite' : 'ember'}
                    min={0}
                    className="w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={cn(
                      'inline-flex w-full items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold text-navy-950 transition-all active:scale-[0.98]',
                      isElite
                        ? SILVER_METALLIC_BG
                        : 'bg-gradient-to-r from-festive-500 to-gold-500',
                    )}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add
                  </button>
                )}
              </div>

              {/* Desktop — view + cart */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-2 gap-2">
                  <ProductLink
                    product={product}
                    className={cn(
                      'inline-flex items-center justify-center gap-1 rounded-lg border py-2 text-[11px] font-semibold transition-all',
                      getCardViewButtonClass(product.tag),
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </ProductLink>
                  {inCart ? (
                    <CartQuantityControl
                      value={quantity}
                      onChange={handleQuantityChange}
                      variant={isElite ? 'elite' : 'ember'}
                      min={0}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={cn(
                        'inline-flex items-center justify-center gap-1 rounded-lg py-2 text-[11px] font-bold text-navy-950 transition-all hover:brightness-110 active:scale-[0.98]',
                        isElite
                          ? SILVER_METALLIC_BG
                          : 'bg-gradient-to-r from-festive-500 to-gold-500',
                      )}
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                  )}
                </div>
                {inCart && (
                  <p
                    className={cn(
                      'mt-1.5 flex items-center justify-center gap-1 text-[9px] font-medium tracking-wide',
                      isElite ? 'text-cyan-300/80' : 'text-gold-400/80',
                    )}
                  >
                    <ShoppingCart className="h-3 w-3 shrink-0" aria-hidden="true" />
                    Added to cart
                  </p>
                )}
              </div>
            </div>
          ) : (
            <ProductLink
              product={product}
              className={cn(
                'mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 pt-2 text-[11px] font-semibold sm:mt-3 sm:py-2.5',
                getCardViewButtonClass(product.tag),
              )}
            >
              View details
              <ArrowRight className="h-3 w-3" />
            </ProductLink>
          )}
        </div>
      </div>
    </article>
  )
})
