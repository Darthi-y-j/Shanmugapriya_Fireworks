import type { Product } from '@/types/database'
import type { ProductViewMode } from '@/hooks/useProductViewMode'
import { ProductGrid } from './ProductGrid'
import { ProductTable } from './ProductTable'
import { ProductViewToggle } from './ProductViewToggle'

interface ProductCatalogueProps {
  products: Product[]
  view: ProductViewMode
  onViewChange: (mode: ProductViewMode) => void
  columns?: 2 | 3 | 4
  emptyTitle?: string
  emptyDescription?: string
  showViewToggle?: boolean
  cardVariant?: 'default' | 'catalogue'
}

export function ProductCatalogue({
  products,
  view,
  onViewChange,
  columns = 3,
  emptyTitle,
  emptyDescription,
  showViewToggle = true,
  cardVariant = 'default',
}: ProductCatalogueProps) {
  return (
    <>
      {showViewToggle && (
        <div className="mb-5">
          <ProductViewToggle value={view} onChange={onViewChange} />
        </div>
      )}

      {view === 'card' ? (
        <ProductGrid
          products={products}
          columns={columns}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          variant={cardVariant}
        />
      ) : (
        <ProductTable
          products={products}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      )}
    </>
  )
}
