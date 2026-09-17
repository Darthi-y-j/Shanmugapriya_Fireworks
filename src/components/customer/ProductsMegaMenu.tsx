import { Link } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import type { Category } from '@/types/database'
import {
  distributeMegaMenuColumns,
  resolveMegaMenuGroups,
} from '@/lib/categoryMegaMenu'
import { cn } from '@/lib/utils'

interface ProductsMegaMenuProps {
  categories: Category[]
  onNavigate?: () => void
  className?: string
}

function MegaMenuGroup({
  title,
  categories,
  onNavigate,
}: {
  title: string
  categories: Category[]
  onNavigate?: () => void
}) {
  return (
    <div>
      <p className="text-sm font-bold text-navy-900">{title}</p>
      <ul className="mt-3 space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/products?category=${category.id}`}
              onClick={onNavigate}
              className="text-sm text-navy-600 transition-colors hover:text-gold-600"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductsMegaMenu({ categories, onNavigate, className }: ProductsMegaMenuProps) {
  const groups = resolveMegaMenuGroups(categories)
  const columns = distributeMegaMenuColumns(groups, 4)

  if (categories.length === 0) {
    return (
      <div className={cn('border-t border-navy-100 bg-white px-6 py-8 shadow-xl', className)}>
        <p className="text-center text-sm text-navy-600">No categories available yet.</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'border-t border-navy-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Shop by Category
            </p>
            <p className="mt-1 font-display text-xl font-bold text-navy-900">
              Browse our full fireworks catalogue
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/products"
              onClick={onNavigate}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
            >
              <LayoutGrid className="h-4 w-4" />
              All Products
            </Link>
            <Link
              to="/categories"
              onClick={onNavigate}
              className="inline-flex items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-800 transition hover:border-gold-400 hover:text-gold-700"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-8">
              {column.map((group) => (
                <MegaMenuGroup
                  key={group.title}
                  title={group.title}
                  categories={group.categories}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProductsMegaMenuMobileProps {
  categories: Category[]
  onNavigate?: () => void
}

export function ProductsMegaMenuMobile({ categories, onNavigate }: ProductsMegaMenuMobileProps) {
  const groups = resolveMegaMenuGroups(categories)

  return (
    <div className="mt-2 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold-400/90">
        Shop by Category
      </p>
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-bold text-white/90">{group.title}</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {group.categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                onClick={onNavigate}
                className="rounded-lg px-2 py-1.5 text-sm text-white/75 hover:bg-white/5 hover:text-gold-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <Link
        to="/products"
        onClick={onNavigate}
        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200"
      >
        View all products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
