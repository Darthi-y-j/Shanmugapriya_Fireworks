import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuantitySelector } from './QuantitySelector'

interface CartQuantityControlProps {
  value: number
  onChange: (value: number) => void
  variant?: 'default' | 'ember' | 'silver' | 'elite' | 'table'
  compact?: boolean
  min?: number
  className?: string
}

export function CartQuantityControl({
  value,
  onChange,
  variant = 'ember',
  compact = true,
  min = 0,
  className,
}: CartQuantityControlProps) {
  const isEmber = variant === 'ember'
  const isSilver = variant === 'silver'
  const isElite = variant === 'elite'

  return (
    <div className={cn('flex min-w-0 items-stretch gap-1', className)}>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-lg border',
          compact ? 'w-8 sm:w-9' : 'w-10',
          isEmber
            ? 'border-gold-500/25 bg-gold-500/10 text-gold-400'
            : isElite
              ? 'border-slate-400/30 bg-indigo-500/12 text-slate-200'
              : isSilver
                ? 'border-slate-400/30 bg-slate-400/10 text-slate-300'
                : 'border-navy-800/12 bg-gold-500/10 text-festive-600',
        )}
        aria-hidden="true"
      >
        <ShoppingCart className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </span>
      <QuantitySelector
        value={value}
        onChange={onChange}
        variant={variant}
        compact={compact}
        min={min}
        className="min-w-[4.5rem] shrink-0 animate-fade-up"
      />
    </div>
  )
}
