import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  variant?: 'default' | 'ember' | 'silver' | 'elite' | 'table'
  compact?: boolean
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  className,
  variant = 'default',
  compact = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1)
  }

  const increase = () => {
    if (value < max) onChange(value + 1)
  }

  const isEmber = variant === 'ember'
  const isSilver = variant === 'silver'
  const isElite = variant === 'elite'
  const isTable = variant === 'table'
  const btnSize = isTable ? 'h-6 w-6 shrink-0' : compact ? 'h-8 w-8 shrink-0' : 'h-10 w-10 shrink-0'
  const valueSize = isTable ? 'min-h-6 w-6 text-xs' : compact ? 'min-h-8 text-xs' : 'min-h-10 text-sm'

  return (
    <div
      className={cn(
        'inline-flex items-stretch',
        isTable
          ? 'rounded-full border border-navy-900/10 bg-white p-0.5'
          : cn(
              'rounded-lg border',
              !className?.includes('w-') && !className?.includes('min-w-') && 'w-full',
              isEmber
                ? 'border-gold-500/25 bg-white/[0.04]'
                : isElite
                  ? 'border-cyan-400/28 bg-indigo-950/20'
                  : isSilver
                    ? 'border-slate-400/30 bg-white/[0.04]'
                    : 'border-navy-800/20',
            ),
        className,
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className={cn(
          'flex items-center justify-center rounded-full transition disabled:opacity-35',
          btnSize,
          isTable
            ? 'text-navy-700'
            : isEmber
              ? 'text-gold-400 hover:bg-white/5'
              : isElite
                ? 'text-cyan-300 hover:bg-white/5'
                : isSilver
                  ? 'text-slate-300 hover:bg-white/5'
                  : 'text-navy-700 hover:bg-navy-800/5',
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={isTable || compact ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
      <span
        className={cn(
          'flex items-center justify-center text-center font-semibold tabular-nums',
          !isTable && 'min-w-0 flex-1',
          valueSize,
          isTable
            ? 'text-navy-950'
            : cn(
                'flex-1 border-x',
                isEmber
                  ? 'border-gold-500/20 text-cream-50'
                  : isElite
                    ? 'border-cyan-400/22 text-slate-100'
                    : isSilver
                      ? 'border-slate-400/25 text-slate-100'
                      : 'border-navy-800/20',
              ),
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className={cn(
          'flex items-center justify-center rounded-full transition disabled:opacity-35',
          btnSize,
          isTable
            ? 'text-navy-700'
            : isEmber
              ? 'text-gold-400 hover:bg-white/5'
              : isElite
                ? 'text-cyan-300 hover:bg-white/5'
                : isSilver
                  ? 'text-slate-300 hover:bg-white/5'
                  : 'text-navy-700 hover:bg-navy-800/5',
        )}
        aria-label="Increase quantity"
      >
        <Plus className={isTable || compact ? 'h-3 w-3' : 'h-4 w-4'} />
      </button>
    </div>
  )
}
