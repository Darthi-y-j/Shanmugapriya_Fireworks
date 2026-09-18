import type { ImgHTMLAttributes } from 'react'
import { assetWithWebp } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  /** Eager load + preload for LCP images. */
  priority?: boolean
  /** Optional responsive WebP srcset (sizes attribute recommended). */
  webpSrcSet?: string
  sizes?: string
}

/** Static site image with WebP source and PNG/JPG fallback. */
export function OptimizedImage({
  src,
  alt = '',
  priority = false,
  className,
  loading,
  decoding = 'async',
  fetchPriority,
  webpSrcSet,
  sizes,
  ...rest
}: OptimizedImageProps) {
  const { webp, fallback } = assetWithWebp(src)

  return (
    <picture>
      <source srcSet={webpSrcSet ?? webp} type="image/webp" sizes={webpSrcSet ? sizes : undefined} />
      <img
        src={fallback}
        alt={alt}
        className={cn(className)}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={priority ? 'sync' : decoding}
        fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
        sizes={webpSrcSet ? sizes : undefined}
        {...rest}
      />
    </picture>
  )
}
