import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types/database'
import { SectionHeader } from './SectionHeader'
import { ProductGrid } from './ProductGrid'
import { getProductTagLabel } from '@/lib/productTags'
import { getSectionAccentForTag, isEliteProductTag } from '@/lib/productCardThemes'
import { cn } from '@/lib/utils'

interface TaggedProductsSectionProps {
  tag: string
  products: Product[]
  initialVisible?: number
  batchSize?: number
}

export function TaggedProductsSection({
  tag,
  products,
  initialVisible = 8,
  batchSize = 12,
}: TaggedProductsSectionProps) {
  if (products.length === 0) return null

  const title = getProductTagLabel(tag)
  const sectionAccent = getSectionAccentForTag(tag)
  const isElite = isEliteProductTag(tag)

  return (
    <section className="pb-6 pt-2 sm:pb-8 sm:pt-4">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeader
            label="Collection"
            title={title}
            description={`Handpicked ${title.toLowerCase()} fireworks for your celebrations`}
            showAccent={false}
            accent={sectionAccent}
          />
          <Link
            to={`/products?tag=${encodeURIComponent(tag)}`}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border bg-cream-50 px-4 py-2 text-xs font-semibold transition-colors sm:self-end sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm',
              isElite
                ? 'border-slate-500/30 text-slate-700 hover:border-cyan-600/35 hover:bg-cyan-50/60'
                : sectionAccent === 'premium-plus'
                  ? 'border-amber-700/30 text-amber-950 hover:border-amber-700/45 hover:bg-amber-50/70'
                  : sectionAccent === 'premium'
                    ? 'border-festive-600/25 text-amber-900 hover:border-festive-600/40 hover:bg-festive-50/60'
                    : 'border-gold-500/25 text-festive-500 hover:border-gold-500/40 hover:bg-gold-500/10',
            )}
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 sm:mt-6">
          <ProductGrid
            products={products}
            columns={4}
            initialVisible={initialVisible}
            batchSize={batchSize}
          />
        </div>
      </div>
    </section>
  )
}
