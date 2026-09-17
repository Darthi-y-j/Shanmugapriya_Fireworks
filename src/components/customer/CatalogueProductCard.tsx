import { memo } from 'react'
import { ProductLink } from './ProductLink'
import { Eye, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, truncate, cn } from '@/lib/utils'
import { useProductCartState } from '@/hooks/useProductCartState'
import { CartQuantityControl } from './CartQuantityControl'
import { ProductPiecesBadge } from './ProductPiecesBadge'
import { DiscountOfferTag } from './DiscountOfferTag'
import { WishlistButton } from './WishlistButton'
import { ProductBrandBadge } from './ProductBrandBadge'
import { ProductTagBadge } from './ProductTagBadge'
import { ProductHighlightBadges } from './ProductHighlightBadges'
import { getCardDescriptionClass, getCardCategoryClass, getCardTitleClass, CARD_TITLE_BASE_CLASS, getCardViewButtonClass, getCardPerforationDotClass, getCardPerforationLineClass, isEliteProductTag } from '@/lib/productCardThemes'
import { isPriorityProductIndex } from './ProductImage'
import { isCardVisibleProductTag } from '@/lib/productTags'

interface CatalogueProductCardProps {
  product: Product
  index?: number
}

export const CatalogueProductCard = memo(function CatalogueProductCard({
  product,
  index = 0,
}: CatalogueProductCardProps) {
  const priorityImage = isPriorityProductIndex(index)
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)

  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const showCategory = product.category && !isCardVisibleProductTag(product.tag)

  return (
    <article
      className="product-grid-item group relative flex h-full flex-col overflow-hidden rounded-xl bg-black shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-300 sm:rounded-2xl sm:shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:hover:-translate-y-0.5 sm:hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
    >
      <ProductLink product={product} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1a120e]">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
            alt={product.name}
            loading={priorityImage ? 'eager' : 'lazy'}
            decoding={priorityImage ? 'sync' : 'async'}
            fetchPriority={priorityImage ? 'high' : 'auto'}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {hasDiscount && (
            <DiscountOfferTag
              percentage={product.discount_percentage!}
              variant={isEliteProductTag(product.tag) ? 'elite' : 'festive'}
              className="z-20 w-8 pt-1.5 pb-2.5 sm:w-[42px] sm:pt-2 sm:pb-3.5 [&_span:first-child]:text-[10px] sm:[&_span:first-child]:text-[13px]"
            />
          )}

          <div className="absolute left-2 top-2 z-20 flex flex-col items-start gap-1.5 sm:left-2.5 sm:top-2.5">
            <ProductHighlightBadges product={product} />
            {product.tag && (
              <ProductTagBadge tag={product.tag} variant="overlay" compact />
            )}
            <WishlistButton
              product={product}
              className="rounded-full bg-black/40 p-1 backdrop-blur-sm hover:bg-black/55"
              size="sm"
            />
          </div>

          {product.brand && (
            <div className="absolute inset-x-2 bottom-2 z-10 sm:inset-x-3 sm:bottom-3">
              <ProductBrandBadge brand={product.brand} variant="overlay" className="max-w-full" />
            </div>
          )}
        </div>

        <div className="relative hidden items-center bg-black px-3 py-1 sm:flex" aria-hidden="true">
          <div className={cn('h-3 w-3 -translate-x-1/2 rounded-full', getCardPerforationDotClass(product.tag))} />
          <div className={cn('mx-2 flex-1 border-t border-dashed', getCardPerforationLineClass(product.tag))} />
          <div className={cn('h-3 w-3 translate-x-1/2 rounded-full', getCardPerforationDotClass(product.tag))} />
        </div>
      </ProductLink>

      <div className="flex flex-1 flex-col bg-black px-2.5 pb-2.5 pt-2 sm:px-4 sm:pb-4 sm:pt-2.5">
        <ProductLink product={product} className="block">
          <h3 className={cn(CARD_TITLE_BASE_CLASS, getCardTitleClass(product.tag))}>
            {product.name}
          </h3>
        </ProductLink>

        {showCategory && (
          <span
            className={cn(
              'mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.18em] sm:inline',
              getCardCategoryClass(product.tag),
            )}
          >
            {product.category!.name}
          </span>
        )}

        {product.description && (
          <p className={cn('mt-1.5 hidden line-clamp-2 text-xs leading-relaxed sm:block', getCardDescriptionClass(product.tag))}>
            {truncate(product.description, 90)}
          </p>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 sm:mt-3 sm:gap-2 sm:px-3 sm:py-2.5">
          <div className="min-w-0">
            {price ? (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-2">
                {originalPrice && (
                  <span className="text-[10px] leading-none text-white/40 line-through sm:text-sm">{originalPrice}</span>
                )}
                <span className="bg-gradient-to-r from-gold-300 via-amber-400 to-orange-400 bg-clip-text text-sm font-bold leading-none text-transparent sm:text-xl">
                  {price}
                </span>
              </div>
            ) : (
              <span className="bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-[11px] font-semibold text-transparent sm:text-sm">
                Enquire
              </span>
            )}
          </div>
          <ProductPiecesBadge product={product} className="hidden shrink-0 sm:inline-flex" />
        </div>

        {product.is_available ? (
          <div className="mt-auto pt-2 sm:mt-3 sm:pt-0">
            {/* Mobile — compact single action */}
            <div className="sm:hidden">
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
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 py-2 text-[11px] font-bold text-navy-950 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Add
                </button>
              )}
            </div>

            {/* Desktop — full actions */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-2">
                <ProductLink
                  product={product}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-semibold transition-all',
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
                    variant="ember"
                    min={0}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 py-2.5 text-xs font-bold text-navy-950 transition-all hover:brightness-110 active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                )}
              </div>
              {inCart && (
                <p className="mt-2 flex items-center justify-center gap-1 text-center text-[10px] font-medium tracking-wide bg-gradient-to-r from-gold-500/80 to-amber-400/80 bg-clip-text text-transparent">
                  <ShoppingCart className="h-3 w-3 shrink-0 text-gold-400" aria-hidden="true" />
                  <span>Added to cart</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <ProductLink
            product={product}
            className={cn(
              'mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 pt-2 text-[11px] font-semibold sm:mt-3 sm:py-2.5 sm:text-xs',
              getCardViewButtonClass(product.tag),
            )}
          >
            View details
          </ProductLink>
        )}
      </div>
    </article>
  )
})
