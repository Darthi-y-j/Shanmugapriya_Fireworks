import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, LayoutGrid, SlidersHorizontal, X } from 'lucide-react'
import type { Category } from '@/types/database'
import { getCategoryIcon } from '@/lib/categoryIcons'
import { cn } from '@/lib/utils'

interface CategoryNavProps {
  categories: Category[]
  categoryCounts: Record<string, number>
  totalCount: number
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  className?: string
}

function CategoryRow({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 border-l-[3px] py-2.5 pl-3 pr-2 text-left text-sm transition-colors',
        active
          ? 'border-gold-500 bg-[#f5f0e8] font-medium text-navy-900'
          : 'border-transparent text-navy-700/70 hover:bg-gray-50',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-gold-500' : 'text-navy-700/40')} />
      <span className="flex-1 truncate">{label}</span>
      <span className="text-xs tabular-nums text-navy-700/40">{count}</span>
    </button>
  )
}

export function ShopByCategoryNav({
  categories,
  categoryCounts,
  totalCount,
  selectedCategoryId,
  onCategoryChange,
  className,
}: CategoryNavProps) {
  return (
    <div className={className}>
      <h2 className="font-display text-xl font-bold text-navy-900">Shop By</h2>
      <p className="mb-3 mt-1 text-xs font-semibold uppercase tracking-wider text-navy-700/45">
        Category Type
      </p>
      <nav>
        <CategoryRow
          icon={LayoutGrid}
          label="All Categories"
          count={totalCount}
          active={!selectedCategoryId}
          onClick={() => onCategoryChange('')}
        />
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            icon={getCategoryIcon(cat.slug, cat.name)}
            label={cat.name}
            count={categoryCounts[cat.id] ?? 0}
            active={selectedCategoryId === cat.id}
            onClick={() => onCategoryChange(cat.id)}
          />
        ))}
      </nav>
    </div>
  )
}

interface FilterByPanelProps {
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  brands?: string[]
  selectedBrand?: string
  onBrandChange?: (brand: string) => void
  maxPrice?: number
  className?: string
  showHeading?: boolean
}

export function FilterByPanel({
  priceRange,
  onPriceRangeChange,
  brands = [],
  selectedBrand = '',
  onBrandChange,
  maxPrice = 5000,
  className,
  showHeading = true,
}: FilterByPanelProps) {
  const [min, max] = priceRange
  const progress = `${(max / maxPrice) * 100}%`

  return (
    <div className={className}>
      {showHeading && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-navy-700/45">
          Filter By
        </p>
      )}
      <div className="space-y-5">
        <div>
          <label className="mb-3 block text-sm font-medium text-navy-900">Price Range</label>
          <div className="catalogue-range-wrap">
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={100}
              value={max}
              onChange={(e) => {
                const next = Math.min(maxPrice, Math.max(0, Number(e.target.value)))
                onPriceRangeChange([min, next])
              }}
              className="catalogue-range w-full"
              style={{ ['--range-progress' as string]: progress }}
              aria-label="Maximum price"
              aria-valuemin={0}
              aria-valuemax={maxPrice}
              aria-valuenow={max}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-navy-700/50">
            <span>₹{min}</span>
            <span>{max >= maxPrice ? `₹${maxPrice}+` : `Up to ₹${max.toLocaleString('en-IN')}`}</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-navy-900">Brand</label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-8 text-sm text-navy-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-navy-700/45"
              value={selectedBrand}
              onChange={(e) => onBrandChange?.(e.target.value)}
              disabled={brands.length === 0}
              aria-label="Filter by brand"
            >
              <option value="">
                {brands.length === 0 ? 'No brands available' : 'All Brands'}
              </option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-700/40" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface MobileFilterDropdownProps {
  categories: Category[]
  categoryCounts: Record<string, number>
  totalCount: number
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  brands?: string[]
  selectedBrand?: string
  onBrandChange?: (brand: string) => void
  maxPrice?: number
  className?: string
  inline?: boolean
}

export function MobileFilterDropdown({
  categories,
  categoryCounts,
  totalCount,
  selectedCategoryId,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  brands = [],
  selectedBrand = '',
  onBrandChange,
  maxPrice = 5000,
  className,
  inline = false,
}: MobileFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hasActiveFilters =
    Boolean(selectedCategoryId) || Boolean(selectedBrand) || priceRange[1] < maxPrice

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (inline) {
        if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
        setOpen(false)
        return
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, inline])

  useEffect(() => {
    if (!open || !inline) return

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
  }, [open, inline])

  const clearFilters = () => {
    onCategoryChange('')
    onBrandChange?.('')
    onPriceRangeChange([0, maxPrice])
  }

  const panelBody = (
    <>
      <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
        <p className="font-display text-base font-bold text-navy-900">Filters</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close filters"
          className="rounded-lg p-1 text-navy-700/50 transition-colors hover:bg-cream-100 hover:text-navy-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide p-4">
        <ShopByCategoryNav
          categories={categories}
          categoryCounts={categoryCounts}
          totalCount={totalCount}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={onCategoryChange}
        />

        <div className="mt-6 border-t border-cream-200 pt-5">
          <FilterByPanel
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={onBrandChange}
            maxPrice={maxPrice}
            showHeading={false}
          />
        </div>
      </div>

      <div className="flex gap-2 border-t border-cream-200 bg-cream-50/50 p-3">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 rounded-lg border border-navy-900/10 bg-white py-2 text-sm font-semibold text-navy-700 transition-colors hover:bg-cream-50"
          >
            Clear all
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg bg-gradient-to-r from-festive-500 to-gold-500 py-2 text-sm font-bold text-navy-950 transition hover:brightness-110"
        >
          Apply
        </button>
      </div>
    </>
  )

  const inlineMobilePanel =
    open && inline && typeof document !== 'undefined'
      ? createPortal(
          <>
            <button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[70] bg-navy-950/45"
              onClick={() => setOpen(false)}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-4 top-[max(5.5rem,10dvh)] z-[71] flex max-h-[min(78dvh,34rem)] flex-col overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_12px_40px_rgba(12,8,6,0.12)]"
            >
              {panelBody}
            </div>
          </>,
          document.body,
        )
      : null

  const anchoredPanel =
    open && !inline ? (
      <div
        ref={panelRef}
        className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_12px_40px_rgba(12,8,6,0.12)]"
      >
        {panelBody}
      </div>
    ) : null

  if (inline) {
    return (
      <div className="relative shrink-0 lg:hidden">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            'relative inline-flex shrink-0 items-center justify-center gap-1 rounded-full border font-semibold transition-colors',
            'h-9 px-2.5 text-[11px]',
            open || hasActiveFilters
              ? 'border-festive-500/30 bg-festive-500/10 text-festive-600'
              : 'border-navy-900/10 bg-white text-navy-800 hover:border-gold-500/30',
            className,
          )}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          <span>Filter</span>
          {hasActiveFilters && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-festive-500" />}
          <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
        </button>
        {inlineMobilePanel}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative lg:hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
          open || hasActiveFilters
            ? 'border-festive-500/30 bg-festive-500/5 text-festive-600'
            : 'border-navy-900/10 bg-white text-navy-900 hover:border-gold-500/30 hover:bg-cream-50',
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-festive-500 px-1 text-[10px] font-bold text-white">
            !
          </span>
        )}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {anchoredPanel}
    </div>
  )
}
