import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/types/database'
import { ProductCard } from './ProductCard'
import { EmptyState } from './EmptyState'
import { Link } from 'react-router-dom'

interface ProductGridProps {
  products: Product[]
  columns?: 1 | 2 | 3 | 4
  emptyTitle?: string
  emptyDescription?: string
  variant?: 'default' | 'catalogue'
  /** Progressive render batch size — off-screen cards mount as you scroll */
  batchSize?: number
  /** How many cards to show before progressive loading kicks in */
  initialVisible?: number
}

const DEFAULT_INITIAL_VISIBLE = 12

export function ProductGrid({
  products,
  columns = 4,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or check back later.',
  variant = 'default',
  batchSize = 24,
  initialVisible = DEFAULT_INITIAL_VISIBLE,
}: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(initialVisible)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCount(Math.min(initialVisible, products.length))
  }, [products, initialVisible])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + batchSize, products.length))
        }
      },
      { rootMargin: '400px 0px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [batchSize, products.length])

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link
            to="/products"
            className="btn-hover-lift rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
          >
            Browse All Products
          </Link>
        }
      />
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const visibleProducts = products.slice(0, visibleCount)

  return (
    <>
      <div className={`grid ${gridCols[columns]} items-stretch gap-3 sm:gap-7`}>
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} variant={variant} />
        ))}
      </div>
      {visibleCount < products.length && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
      )}
    </>
  )
}
