import type { CSSProperties } from 'react'
import type { Product } from '@/types/database'
import { EmptyState } from '@/components/customer/EmptyState'
import type { PrimeProductViewMode } from '@/hooks/usePrimeProductViewMode'
import { PrimeProductTable } from './PrimeProductTable'
import { PrimeProductCard } from './PrimeProductCard'
import { PrimeProductCompactCard } from './PrimeProductCompactCard'
import { PrimeCategoryHeader } from './PrimeCategoryHeader'

interface ProductGroup {
  id: string
  name: string
  products: Product[]
}

interface PrimeProductGroupedViewsProps {
  groups: ProductGroup[]
  view: PrimeProductViewMode
  showCategoryHeaders?: boolean
  emptyTitle?: string
}

export function PrimeProductGroupedViews({
  groups,
  view,
  showCategoryHeaders = true,
  emptyTitle = 'Catalogue coming soon',
}: PrimeProductGroupedViewsProps) {
  const totalProducts = groups.reduce((n, g) => n + g.products.length, 0)

  if (totalProducts === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description="Our product catalogue will be added soon. Contact us on WhatsApp to enquire in the meantime."
      />
    )
  }

  if (view === 'table') {
    return <PrimeProductTable groups={groups} showCategoryHeaders={showCategoryHeaders} />
  }

  if (view === 'card') {
    return (
      <div className="space-y-6">
        {groups.map((group, groupIndex) => (
          <section key={group.id} id={`category-${group.id}`} className="scroll-mt-44">
            <div className="overflow-hidden rounded-xl border-2 border-[#0F2847]/15 bg-white shadow-md">
              {showCategoryHeaders && <PrimeCategoryHeader name={group.name} />}
              <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-2 sm:gap-5 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
                {group.products.map((product, i) => (
                  <div
                    key={product.id}
                    data-reveal="scale-in"
                    style={{ '--reveal-delay': `${(i % 6) * 50}ms` } as CSSProperties}
                  >
                    <PrimeProductCard product={product} priority={groupIndex === 0 && i < 12} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
        {groups.map((group, groupIndex) => (
          <section key={group.id} id={`category-${group.id}`} className="scroll-mt-44">
            <div className="overflow-hidden rounded-xl border-2 border-[#0F2847]/15 bg-white shadow-md">
              {showCategoryHeaders && <PrimeCategoryHeader name={group.name} />}
            <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 sm:gap-4 sm:p-4 lg:grid-cols-3 lg:gap-5 lg:p-5">
              {group.products.map((product, i) => (
                <div
                  key={product.id}
                  data-reveal="scale-in"
                  style={{ '--reveal-delay': `${(i % 6) * 50}ms` } as CSSProperties}
                >
                  <PrimeProductCompactCard product={product} priority={groupIndex === 0 && i < 8} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
