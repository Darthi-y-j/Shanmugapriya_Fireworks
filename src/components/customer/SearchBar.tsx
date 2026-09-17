import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onSubmit?: () => void
  onFocus?: () => void
  onBlur?: () => void
  variant?: 'light' | 'dark'
  compact?: boolean
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search products...',
  className,
  onSubmit,
  onFocus,
  onBlur,
  variant = 'light',
  compact = false,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  const isDark = variant === 'dark'

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2',
          compact ? 'left-2.5 h-4 w-4' : 'left-3 h-5 w-5',
          isDark ? 'text-gold-400/60' : 'text-navy-700/40',
        )}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          'w-full text-sm focus:outline-none focus:ring-2',
          compact ? 'rounded-full py-2 pl-8 pr-3' : 'rounded-xl py-3 pl-10 pr-4',
          isDark
            ? 'border border-gold-400/25 bg-white/5 text-cream-50 placeholder:text-cream-100/40 focus:border-gold-400/50 focus:ring-gold-400/15'
            : 'rounded-full border border-navy-900/8 bg-white text-navy-900 shadow-sm placeholder:text-navy-700/40 focus:border-festive-400/40 focus:ring-festive-400/10'
        )}
      />
    </form>
  )
}
