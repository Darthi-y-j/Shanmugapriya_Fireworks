import { LayoutGrid } from 'lucide-react'
import { getImageUrl, cn } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/categoryIcons'
import type { Category } from '@/types/database'

interface CategoryIconStripProps {
  categories: Category[]
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

export function CategoryIconStrip({
  categories,
  selectedCategoryId,
  onCategoryChange,
  className,
}: CategoryIconStripProps) {
  const displayCategories = [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )

  return (
    <div
      className={cn(
        'scrollbar-hide flex gap-2 overflow-x-auto sm:gap-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onCategoryChange('')}
        title="All Categories"
        className={cn(
          'flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-all sm:w-[92px] sm:gap-2 sm:py-2.5',
          'border-2 border-transparent hover:bg-gray-50/80',
        )}
      >
        <div
          className={cn(
            'flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-navy-950 transition-all sm:h-14 sm:w-14',
            !selectedCategoryId &&
              'shadow-[0_0_0_2px_rgba(251,191,36,0.55),0_0_18px_rgba(245,158,11,0.55),0_0_6px_rgba(245,158,11,0.35)]',
          )}
        >
          <LayoutGrid className="h-5 w-5 text-gold-400/80 sm:h-6 sm:w-6" />
        </div>
        <span
          className={cn(
            'line-clamp-2 w-full text-center text-[10px] leading-tight sm:text-[11px]',
            !selectedCategoryId ? 'font-semibold text-navy-900' : 'font-medium text-navy-700/65',
          )}
        >
          All Categories
        </span>
      </button>
      {displayCategories.map((cat) => {
        const Icon = getCategoryIcon(cat.slug, cat.name)
        const active = selectedCategoryId === cat.id

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(active ? '' : cat.id)}
            title={cat.name}
            className={cn(
              'flex w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-all sm:w-[92px] sm:gap-2 sm:py-2.5',
              'border-2 border-transparent hover:bg-gray-50/80',
            )}
          >
            <div
              className={cn(
                'flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-navy-950 transition-all sm:h-14 sm:w-14',
                active &&
                  'shadow-[0_0_0_2px_rgba(251,191,36,0.55),0_0_18px_rgba(245,158,11,0.55),0_0_6px_rgba(245,158,11,0.35)]',
              )}
            >
              {cat.image_url ? (
                <img src={getImageUrl(cat.image_url)} alt="" className="h-full w-full object-cover" />
              ) : (
                <Icon className="h-5 w-5 text-gold-400/80 sm:h-6 sm:w-6" />
              )}
            </div>
            <span
              className={cn(
                'line-clamp-2 w-full text-center text-[10px] leading-tight sm:text-[11px]',
                active ? 'font-semibold text-navy-900' : 'font-medium text-navy-700/65',
              )}
            >
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
