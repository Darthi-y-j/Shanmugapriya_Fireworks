import { Sparkles } from 'lucide-react'
import type { Product } from '@/types/database'
import { cn } from '@/lib/utils'

interface ProductHighlightBadgesProps {
  product: Pick<Product, 'is_recommended' | 'is_best_seller'>
  className?: string
  compact?: boolean
}

export function ProductHighlightBadges({
  product,
  className,
  compact = false,
}: ProductHighlightBadgesProps) {
  const isRecommended = Boolean(product.is_recommended)
  const isBestSeller = Boolean(product.is_best_seller)

  if (!isRecommended && !isBestSeller) return null

  return (
    <div className={cn('flex flex-row flex-wrap items-center gap-1', compact ? 'gap-1' : 'gap-1.5', className)}>
      {isBestSeller && (
        <span
          className={cn(
            'animate-best-seller-pop inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#e91e8c] font-bold text-white shadow-[0_4px_14px_rgba(233,30,140,0.45)]',
            compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px] sm:px-3 sm:py-1 sm:text-[11px]',
          )}
        >
          <span aria-hidden="true">🔥</span>
          Best Selling
        </span>
      )}
      {isRecommended && (
        <span
          className={cn(
            'animate-recommended-badge inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-festive-500 to-gold-400 font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.4)]',
            compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px] sm:px-3 sm:py-1 sm:text-[11px]',
          )}
        >
          <Sparkles className={cn('shrink-0', compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} aria-hidden="true" />
          Recommended
        </span>
      )}
    </div>
  )
}

export function hasProductHighlights(product: Pick<Product, 'is_recommended' | 'is_best_seller'>): boolean {
  return Boolean(product.is_recommended || product.is_best_seller)
}
