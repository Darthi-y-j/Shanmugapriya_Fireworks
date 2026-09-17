import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, X } from 'lucide-react'
import type { Category } from '@/types/database'
import { getSquareImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'

interface PrimeFilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  showTab?: boolean
}

export function PrimeFilterDrawer({
  open,
  onOpenChange,
  categories,
  activeCategory,
  onSelectCategory,
  showTab = false,
}: PrimeFilterDrawerProps) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId)
    onOpenChange(false)
  }

  const toggleDrawer = () => onOpenChange(!open)

  const itemClass = (active: boolean) =>
    cn(
      'flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors',
      active
        ? 'bg-[#0F2847] text-white shadow-sm ring-1 ring-[#C9A24A]/40'
        : 'text-[#0F2847] hover:bg-[#FFF8E1]',
    )

  const thumbShellClass = (active: boolean) =>
    cn(
      'flex h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 bg-[#FFF8E1]',
      active ? 'border-[#E8C56A]' : 'border-[#0F2847]/25',
    )

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[1px]"
          onClick={() => onOpenChange(false)}
          aria-label="Close categories"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[90] flex w-72 max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-[#C9A24A]/40 bg-[#0F2847] px-4 py-3.5">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-[#F5D78E]">
              Categories
            </p>
            <p className="mt-0.5 text-xs text-white">Choose a category to browse</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close categories"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex-1 space-y-1 overflow-y-auto p-2">
          <li>
            <button type="button" onClick={() => handleSelect('')} className={itemClass(!activeCategory)}>
              <span
                className={cn(
                  thumbShellClass(!activeCategory),
                  'flex items-center justify-center',
                  !activeCategory ? 'bg-[#1A3D66]' : 'bg-[#0F2847]/5',
                )}
              >
                <LayoutGrid
                  className={cn('h-6 w-6', !activeCategory ? 'text-[#F5D78E]' : 'text-[#0F2847]')}
                />
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">All Products</span>
            </button>
          </li>
          {categories.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <li key={cat.id}>
                <button type="button" onClick={() => handleSelect(cat.id)} className={itemClass(active)}>
                  <span className={thumbShellClass(active)}>
                    <img
                      src={getSquareImageUrl(cat.image_url, '/placeholder-category.svg', IMAGE_WIDTH.thumb)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{cat.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* Slim left-edge pull tab — only near the product table */}
      <button
        type="button"
        onClick={toggleDrawer}
        className={cn(
          'fixed left-0 top-1/2 z-[110] flex h-14 w-[22px] -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-[#E8C56A]/60 bg-gradient-to-b from-[#E8C56A] to-[#0F2847] shadow-[2px_0_10px_rgba(15,40,71,0.35)] transition-opacity duration-300 hover:from-[#F5D78E] hover:to-[#1A3D66] active:scale-95',
          open && 'h-12 w-6',
          showTab || open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-label={open ? 'Close categories' : 'Open categories'}
        aria-expanded={open}
      >
        {open ? (
          <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5] text-[#0F2847]" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5] text-[#0F2847]" />
        )}
      </button>
    </>
  )
}
