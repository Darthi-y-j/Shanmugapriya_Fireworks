import { Link } from 'react-router-dom'
import { ArrowRight, Layers3 } from 'lucide-react'
import type { Category } from '@/types/database'
import { SectionHeader } from './SectionHeader'
import { CategoryCard } from './CategoryCard'

interface ShopByCategorySectionProps {
  categories: Category[]
}

export function ShopByCategorySection({ categories }: ShopByCategorySectionProps) {
  if (categories.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-white pb-6 pt-2 sm:pb-10 sm:pt-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <SectionHeader
            icon={Layers3}
            label="Categories"
            title="Shop by Category"
            description="Find the perfect fireworks for every occasion"
            badge={`${categories.length} types`}
            showAccent={false}
          />

          <Link
            to="/categories"
            className="inline-flex shrink-0 items-center gap-2 self-end rounded-full bg-gradient-to-r from-[#fbbf24] via-festive-500 to-[#f59e0b] px-5 py-2.5 text-sm font-bold text-navy-950 shadow-[0_8px_28px_rgba(234,88,12,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(234,88,12,0.35)] sm:mb-1 sm:px-6 sm:py-3"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
