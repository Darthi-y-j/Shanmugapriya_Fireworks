import type { Category, Product } from '@/types/database'
import type { CatalogueView } from './CatalogueToolbar'
import { ProductGrid } from './ProductGrid'
import { ProductTable, ProductTableCategoryRow } from './ProductTable'

export interface CategoryProductGroup {
  id: string
  name: string
  products: Product[]
}

export function groupProductsByCategory(
  products: Product[],
  categories: Category[],
): CategoryProductGroup[] {
  const byId = new Map<string, Product[]>()
  const uncategorized: Product[] = []

  for (const product of products) {
    if (product.category_id) {
      const list = byId.get(product.category_id) ?? []
      list.push(product)
      byId.set(product.category_id, list)
    } else {
      uncategorized.push(product)
    }
  }

  const orderedCategories = [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )

  const groups: CategoryProductGroup[] = []

  for (const category of orderedCategories) {
    const list = byId.get(category.id)
    if (!list?.length) continue
    groups.push({ id: category.id, name: category.name, products: list })
    byId.delete(category.id)
  }

  const leftover = [...byId.entries()].sort((a, b) => {
    const orderA = a[1][0]?.category?.sort_order ?? Number.MAX_SAFE_INTEGER
    const orderB = b[1][0]?.category?.sort_order ?? Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })

  for (const [id, list] of leftover) {
    groups.push({
      id,
      name: list[0]?.category?.name || 'Other',
      products: list,
    })
  }

  if (uncategorized.length > 0) {
    groups.push({ id: 'uncategorized', name: 'Other', products: uncategorized })
  }

  return groups
}

interface CategoryGroupedProductsProps {
  groups: CategoryProductGroup[]
  view: CatalogueView
}

function CategoryProductSection({ group }: { group: CategoryProductGroup }) {
  return (
    <section className="scroll-mt-32">
      <div className="mb-4 overflow-hidden rounded-xl border border-stone-200/90 sm:mb-5">
        <ProductTableCategoryRow id={group.id} name={group.name} sticky={false} />
      </div>

      <ProductGrid
        products={group.products}
        columns={3}
        variant="catalogue"
        initialVisible={group.products.length}
        batchSize={group.products.length}
      />
    </section>
  )
}

export function CategoryGroupedProducts({ groups, view }: CategoryGroupedProductsProps) {
  if (view === 'table') {
    return <ProductTable groups={groups} />
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      {groups.map((group) => (
        <CategoryProductSection key={group.id} group={group} />
      ))}
    </div>
  )
}
