import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductViewMode } from '@/hooks/useProductViewMode'

interface ProductViewToggleProps {
  value: ProductViewMode
  onChange: (mode: ProductViewMode) => void
  className?: string
}

export function ProductViewToggle({ value, onChange, className }: ProductViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-xl border border-navy-900/10 bg-white p-1 shadow-sm',
        className,
      )}
      role="group"
      aria-label="Product view mode"
    >
      <button
        type="button"
        onClick={() => onChange('card')}
        aria-pressed={value === 'card'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
          value === 'card'
            ? 'bg-navy-950 text-gold-300 shadow-sm'
            : 'text-navy-700/70 hover:text-navy-900',
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Cards
      </button>
      <button
        type="button"
        onClick={() => onChange('table')}
        aria-pressed={value === 'table'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
          value === 'table'
            ? 'bg-navy-950 text-gold-300 shadow-sm'
            : 'text-navy-700/70 hover:text-navy-900',
        )}
      >
        <List className="h-3.5 w-3.5" />
        Table
      </button>
    </div>
  )
}
