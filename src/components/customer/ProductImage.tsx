import { getImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  priority?: boolean
  width?: number
}

/** Product thumbnail — always visible (no fade-in); uses resized Supabase URLs. */
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
  width = IMAGE_WIDTH.detail,
}: ProductImageProps) {
  const imageSrc = getImageUrl(src, '/placeholder-product.svg', width, width)

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn(className)}
    />
  )
}

/** First visible rows in the shop grid load immediately. */
export function isPriorityProductIndex(index: number): boolean {
  return index < 12
}
