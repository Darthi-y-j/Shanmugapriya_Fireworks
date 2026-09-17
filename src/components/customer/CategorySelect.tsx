import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Category } from '@/types/database'
import { cn } from '@/lib/utils'

interface CategorySelectProps {
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
  id?: string
  variant?: 'dark' | 'light'
  className?: string
}

export function CategorySelect({
  categories,
  value,
  onChange,
  id,
  variant = 'dark',
  className,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const options = [{ id: '', name: 'All Categories' }, ...categories.map((cat) => ({ id: cat.id, name: cat.name }))]
  const selected = options.find((option) => option.id === value) ?? options[0]
  const isDark = variant === 'dark'

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg py-0.5 text-left transition-colors focus:outline-none focus-visible:ring-2 sm:py-1',
          isDark
            ? 'text-cream-50 focus-visible:ring-gold-400/40'
            : 'text-navy-900 focus-visible:ring-gold-500/40',
        )}
      >
        <span className="min-w-0 truncate text-xs sm:text-sm">{selected.name}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-transform duration-200 sm:h-4 sm:w-4',
            isDark ? 'text-gold-300/60' : 'text-navy-700/50',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className={cn(
            'absolute left-0 right-0 top-[calc(100%+0.375rem)] z-[120] max-h-56 overflow-y-auto scrollbar-hide rounded-xl border py-1 shadow-[0_16px_40px_rgba(12,8,6,0.35)]',
            isDark
              ? 'border-gold-500/25 bg-gradient-to-b from-navy-900 via-[#2a1a12] to-navy-950'
              : 'border-navy-900/10 bg-white',
          )}
        >
          {options.map((option) => {
            const active = value === option.id

            return (
              <li key={option.id || 'all'} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors sm:text-sm',
                    isDark
                      ? active
                        ? 'bg-gold-500/15 font-medium text-gold-300'
                        : 'text-cream-100/90 hover:bg-white/5 hover:text-gold-200'
                      : active
                        ? 'bg-gold-500/10 font-medium text-festive-600'
                        : 'text-navy-800 hover:bg-cream-50 hover:text-navy-900',
                  )}
                >
                  {option.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
