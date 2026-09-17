import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import type { Category } from '@/types/database'
import { CategorySelect } from './CategorySelect'

interface HeroSearchBarProps {
  categories: Category[]
  /** Hide popular category tags — useful when embedded in a compact hero area */
  compact?: boolean
}

const warmGlassShell =
  'border-gold-500/20 bg-gradient-to-br from-navy-900 via-[#2a1a12] to-navy-950 shadow-[0_12px_32px_rgba(46,30,22,0.2)]'

export function HeroSearchBar({ categories, compact = false }: HeroSearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (location.pathname !== '/products') return
    const params = new URLSearchParams(location.search)
    setSearch(params.get('q') || '')
    setCategory(params.get('category') || '')
  }, [location.pathname, location.search])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (search.trim()) params.set('q', search.trim())
    if (category) params.set('category', category)
    navigate(`/products${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div className="hero-search-bar relative z-20 mx-auto w-full max-w-3xl space-y-3">
      <form
        onSubmit={handleSearch}
        className={`hero-search-form group/search relative rounded-2xl border ${warmGlassShell}`}
      >
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          <div className="hero-search-shimmer absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
        </div>

        <div className="relative z-[2] flex flex-col sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1 border-b border-gold-500/15 px-3 py-2.5 transition-colors duration-300 group-focus-within/search:border-gold-500/25 sm:border-b-0 sm:border-r sm:px-5 sm:py-4">
            <label
              htmlFor="hero-search"
              className="mb-1.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300/80 sm:mb-2 sm:block"
            >
              Search products
            </label>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hero-search-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold-400/35 bg-navy-800 transition-[border-color,transform] duration-300 group-focus-within/search:scale-105 sm:h-9 sm:w-9">
                <Search className="h-3.5 w-3.5 text-gold-300 transition-transform duration-300 group-focus-within/search:scale-110 sm:h-4 sm:w-4" />
              </div>
              <input
                id="hero-search"
                name="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crackers, sparklers..."
                className="min-w-0 flex-1 bg-transparent text-xs text-cream-50 placeholder:text-cream-200/45 transition-colors duration-300 placeholder:transition-opacity focus:outline-none focus:placeholder:text-cream-200/25 sm:text-sm"
              />
            </div>
          </div>

          <div className="relative border-b border-gold-500/15 transition-colors duration-300 group-focus-within/search:border-gold-500/25 sm:w-44 sm:border-b-0 sm:border-r sm:px-4 sm:py-4">
            <label
              htmlFor="hero-category"
              className="mb-1.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300/80 sm:mb-2 sm:block"
            >
              Category
            </label>
            <div className="relative px-3 py-2.5 sm:px-0 sm:py-0">
              <CategorySelect
                id="hero-category"
                categories={categories}
                value={category}
                onChange={setCategory}
                variant="dark"
              />
            </div>
          </div>

          <div className="flex items-center p-1.5 sm:p-2.5">
            <button
              type="submit"
              className="btn-festive flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-bold sm:gap-2 sm:min-w-[7.5rem] sm:rounded-xl sm:px-6 sm:py-4 sm:text-sm"
            >
              Search
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/search:translate-x-0.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </form>

      {categories.length > 0 && !compact && (
        <div className="hero-search-tags flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-gold-500/15 bg-navy-900 px-3 py-2 sm:justify-start sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3">
          <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-gold-300/75 sm:gap-1.5 sm:text-[10px] sm:tracking-[0.12em]">
            <Sparkles className="h-2.5 w-2.5 animate-pulse-gold sm:h-3 sm:w-3" />
            Popular
          </span>
          <div className="hidden h-4 w-px bg-gold-500/20 sm:block" aria-hidden="true" />
          {categories.slice(0, 5).map((cat, i) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="hero-search-tag rounded-full border border-gold-500/15 bg-navy-800 px-2.5 py-1 text-[10px] font-medium text-cream-100 hover:border-gold-400/40 hover:bg-navy-800/80 hover:text-gold-300 sm:px-3.5 sm:py-1.5 sm:text-xs"
              style={{ animation: `hero-search-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${0.35 + i * 0.05}s both` }}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/products"
            className="hero-search-tag rounded-full border border-gold-400/35 bg-gold-500/15 px-2.5 py-1 text-[10px] font-semibold text-gold-300 hover:border-gold-400/50 hover:bg-gold-500/20 sm:px-3.5 sm:py-1.5 sm:text-xs"
            style={{ animation: `hero-search-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${0.6}s both` }}
          >
            View all →
          </Link>
        </div>
      )}
    </div>
  )
}
