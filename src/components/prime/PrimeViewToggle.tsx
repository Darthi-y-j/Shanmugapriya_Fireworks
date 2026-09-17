import { Grid3x3, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PrimeProductViewMode } from '@/hooks/usePrimeProductViewMode'

interface PrimeViewToggleProps {
  value: PrimeProductViewMode
  onChange: (mode: PrimeProductViewMode) => void
  className?: string
}

const MODES: { id: PrimeProductViewMode; label: string; icon: typeof List }[] = [
  { id: 'table', label: 'Table', icon: List },
  { id: 'card', label: 'Cards', icon: LayoutGrid },
  { id: 'compact', label: 'Grid', icon: Grid3x3 },
]

export function PrimeViewToggle({ value, onChange, className }: PrimeViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-[#0F2847]/20 bg-white p-1 shadow-sm',
        className,
      )}
      role="group"
      aria-label="Product view mode"
    >
      {MODES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={cn(
            'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold transition-colors sm:gap-1.5 sm:px-2.5 sm:py-1.5',
            value === id
              ? 'bg-[#0F2847] text-[#0077B6]'
              : 'text-[#0F2847]/70 hover:bg-[#FFF8E1] hover:text-[#0F2847]',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
