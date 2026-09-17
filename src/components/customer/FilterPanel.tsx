import type { Category } from '@/types/database'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  availability: 'all' | 'available' | 'unavailable'
  onAvailabilityChange: (value: 'all' | 'available' | 'unavailable') => void
  sortBy: string
  onSortChange: (value: string) => void
  className?: string
  variant?: 'light' | 'dark'
}

export function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  sortBy,
  onSortChange,
  className,
  variant = 'light',
}: FilterPanelProps) {
  const isDark = variant === 'dark'

  const labelClass = isDark
    ? 'text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-300/75'
    : 'text-sm font-medium text-navy-900'

  const selectClass = isDark
    ? 'w-full rounded-xl border border-gold-500/15 bg-white/5 px-3 py-2.5 text-sm text-cream-100 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/30'
    : 'w-full rounded-lg border border-navy-800/20 bg-white px-3 py-2.5 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500'

  return (
    <div className={cn('space-y-5', className)}>
      <div>
        <label className={cn('mb-2 block', labelClass)}>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClass}
        >
          <option value="" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            All Categories
          </option>
          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
              className={isDark ? 'bg-navy-900 text-cream-100' : ''}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={cn('mb-2 block', labelClass)}>Availability</label>
        <select
          value={availability}
          onChange={(e) => onAvailabilityChange(e.target.value as 'all' | 'available' | 'unavailable')}
          className={selectClass}
        >
          <option value="all" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            All Products
          </option>
          <option value="available" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Available
          </option>
          <option value="unavailable" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Out of Stock
          </option>
        </select>
      </div>

      <div>
        <label className={cn('mb-2 block', labelClass)}>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClass}
        >
          <option value="sort_order" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Default
          </option>
          <option value="name" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Name (A-Z)
          </option>
          <option value="price_asc" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Price: Low to High
          </option>
          <option value="price_desc" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Price: High to Low
          </option>
          <option value="newest" className={isDark ? 'bg-navy-900 text-cream-100' : ''}>
            Newest First
          </option>
        </select>
      </div>
    </div>
  )
}
