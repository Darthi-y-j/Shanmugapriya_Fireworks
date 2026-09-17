import { Package } from 'lucide-react'
import type { Product } from '@/types/database'
import { formatProductPackagingLabel } from '@/lib/packaging'
import { cn } from '@/lib/utils'

interface ProductPiecesBadgeProps {
  pieces?: number | null | undefined
  product?: Pick<Product, 'pieces' | 'specifications'>
  variant?: 'ember' | 'light' | 'silver' | 'elite' | 'table'
  suffix?: string
  className?: string
}

function resolvePackagingLabel({
  pieces,
  product,
}: Pick<ProductPiecesBadgeProps, 'pieces' | 'product'>): string | null {
  if (product) {
    return formatProductPackagingLabel(product)
  }
  if (pieces != null && pieces >= 1) {
    return `${pieces} pcs`
  }
  return null
}

export function ProductPiecesBadge({
  pieces,
  product,
  variant = 'ember',
  suffix = '/ pack',
  className,
}: ProductPiecesBadgeProps) {
  const label = resolvePackagingLabel({ pieces, product })
  if (!label) return null
  const showLegacySuffix = !product && suffix

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-md border font-bold',
        product ? 'normal-case tracking-normal' : 'uppercase tracking-[0.12em]',
        variant === 'ember'
          ? 'shrink-0 rounded-md bg-gold-500/10 px-1.5 py-0.5 text-[9px] tracking-wide text-gold-300 ring-1 ring-inset ring-gold-500/15'
          : variant === 'table'
            ? 'shrink-0 rounded-md border border-orange-300/60 bg-white/70 px-2 py-0.5 text-[10px] tracking-[0.12em] text-festive-700 shadow-sm'
          : variant === 'silver'
            ? 'shrink-0 rounded-md bg-slate-400/10 px-1.5 py-0.5 text-[9px] tracking-wide text-slate-200 ring-1 ring-inset ring-slate-400/25'
            : variant === 'elite'
              ? 'shrink-0 rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] tracking-wide text-cyan-100 ring-1 ring-inset ring-slate-400/20'
            : 'border-festive-500/30 bg-gradient-to-r from-festive-500/10 to-gold-500/10 px-2.5 py-1 text-[11px] text-festive-600',
        className,
      )}
    >
      {variant === 'ember' || variant === 'silver' || variant === 'elite' || variant === 'table' ? (
        <>
          <Package
            className={cn(
              'h-2.5 w-2.5',
              variant === 'table'
                ? 'text-festive-500'
                : variant === 'elite'
                ? 'text-slate-300/85'
                : variant === 'silver'
                  ? 'text-slate-300/80'
                  : 'text-gold-400/80',
            )}
          />
          <span>{label}</span>
        </>
      ) : (
        <>
          <Package className="h-3 w-3 text-festive-500" />
          <span>{label}</span>
          {showLegacySuffix && (
            <span className="font-semibold normal-case tracking-normal text-festive-500/80">
              {suffix}
            </span>
          )}
        </>
      )}
    </span>
  )
}
