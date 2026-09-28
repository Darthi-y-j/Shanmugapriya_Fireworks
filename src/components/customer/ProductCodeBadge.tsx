import { cn } from '@/lib/utils'
import { getProductCode } from '@/lib/productCode'
import type { Product } from '@/types/database'

type ProductCodeSource = Pick<Product, 'sort_order' | 'specifications'>

interface ProductCodeBadgeProps {
  product: ProductCodeSource
  className?: string
  size?: 'xs' | 'sm'
}

export function ProductCodeBadge({ product, className, size = 'sm' }: ProductCodeBadgeProps) {
  const code = getProductCode(product)
  if (code === '—') return null

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md border border-[#0077B6]/35 bg-[#E8F4FC] font-bold tabular-nums text-[#0077B6]',
        size === 'xs' && 'px-1.5 py-0.5 text-[10px] leading-none',
        size === 'sm' && 'px-2 py-0.5 text-xs leading-none',
        className,
      )}
      title={`Product code ${code}`}
    >
      #{code}
    </span>
  )
}
