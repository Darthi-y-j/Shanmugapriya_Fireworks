import type { Product } from '@/types/database'
import { formatProductPackagingLabel } from '@/lib/packaging'
import { cn } from '@/lib/utils'

interface ProductPackagingBadgeProps {
  product: Pick<Product, 'pieces' | 'specifications'>
  compact?: boolean
  className?: string
}

export function ProductPackagingBadge({
  product,
  compact,
  className,
}: ProductPackagingBadgeProps) {
  const label = formatProductPackagingLabel(product)
  if (!label) return null

  return (
    <span
      title={label}
      className={cn(
        'inline-flex max-w-full rounded-md bg-[#FFF8E1] font-bold normal-case leading-snug text-[#0F2847] ring-1 ring-[#0077B6]',
        compact ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs',
        className,
      )}
    >
      {label}
    </span>
  )
}
