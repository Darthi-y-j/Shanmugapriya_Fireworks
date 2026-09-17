import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, LayoutGrid, X } from 'lucide-react'
import type { Category } from '@/types/database'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { getImageUrl, cn } from '@/lib/utils'

interface MobileCategorySideDrawerProps {
  categories: Category[]
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  categoryCounts?: Record<string, number>
  totalCount?: number
  visible?: boolean
}

export function MobileCategorySideDrawer({
  categories,
  selectedCategoryId,
  onCategoryChange,
  categoryCounts = {},
  totalCount = 0,
  visible = true,
}: MobileCategorySideDrawerProps) {
  const [open, setOpen] = useState(false)

  const displayCategories = [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleSelect = (categoryId: string) => {
    onCategoryChange(categoryId)
    setOpen(false)
  }

  const drawer =
    open && typeof document !== 'undefined'
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close categories"
              className="fixed inset-0 z-[70] bg-navy-950/50 backdrop-blur-[2px] sm:hidden"
              onClick={() => setOpen(false)}
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Browse categories"
              className={cn(
                'fixed inset-y-0 left-0 z-[71] flex w-[min(88vw,20rem)] flex-col bg-white shadow-[8px_0_40px_rgba(12,8,6,0.18)] transition-transform duration-300 ease-out sm:hidden',
                open ? 'translate-x-0' : '-translate-x-full',
              )}
            >
              <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3.5">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy-900">Categories</h2>
                  <p className="text-[11px] font-medium text-navy-700/55">Tap to browse products</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close categories"
                  className="rounded-lg p-1.5 text-navy-700/50 transition-colors hover:bg-cream-100 hover:text-navy-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto scrollbar-hide p-3">
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={cn(
                    'mb-2 flex w-full items-center gap-3 rounded-xl border-2 p-2.5 text-left transition-colors',
                    !selectedCategoryId
                      ? 'border-gold-400/60 bg-gold-500/10'
                      : 'border-transparent hover:bg-cream-50',
                  )}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-950">
                    <LayoutGrid className="h-6 w-6 text-gold-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-900">All Categories</p>
                    <p className="text-xs text-navy-700/50">{totalCount} products</p>
                  </div>
                </button>

                <div className="space-y-1">
                  {displayCategories.map((cat) => {
                    const Icon = getCategoryIcon(cat.slug, cat.name)
                    const active = selectedCategoryId === cat.id
                    const count = categoryCounts[cat.id] ?? 0

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(active ? '' : cat.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border-2 p-2.5 text-left transition-colors',
                          active
                            ? 'border-gold-400/60 bg-gold-500/10'
                            : 'border-transparent hover:bg-cream-50',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-950',
                            active &&
                              'shadow-[0_0_0_2px_rgba(251,191,36,0.55),0_0_14px_rgba(245,158,11,0.45)]',
                          )}
                        >
                          {cat.image_url ? (
                            <img
                              src={getImageUrl(cat.image_url)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon className="h-6 w-6 text-gold-400/85" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              'truncate font-semibold',
                              active ? 'text-navy-900' : 'text-navy-800',
                            )}
                          >
                            {cat.name}
                          </p>
                          <p className="text-xs text-navy-700/50">
                            {count} {count === 1 ? 'product' : 'products'}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </nav>
            </aside>
          </>,
          document.body,
        )
      : null

  const trigger =
    typeof document !== 'undefined'
      ? createPortal(
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open categories"
            className={cn(
              'fixed left-0 top-1/2 z-[55] flex h-11 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-gold-400/35 bg-gradient-to-r from-gold-500 to-festive-500 text-navy-950 shadow-[4px_0_16px_rgba(245,158,11,0.35)] transition-opacity duration-200 active:scale-95 sm:hidden',
              visible && !open ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
          </button>,
          document.body,
        )
      : null

  return (
    <>
      {trigger}
      {drawer}
    </>
  )
}
