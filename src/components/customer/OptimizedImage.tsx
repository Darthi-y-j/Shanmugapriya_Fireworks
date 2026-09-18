import { useLayoutEffect, type ImgHTMLAttributes } from 'react'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  /** Eager load + preload for LCP images. */
  priority?: boolean
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
  ...rest
}: OptimizedImageProps) {
  const { webp, fallback } = assetWithWebp(src)

  useLayoutEffect(() => {
    if (priority) preloadImage(webp)
  }, [priority, webp])

  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={fallback}
        alt={alt}
        className={cn(className)}
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={decoding}
        fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
        {...rest}
      />
    </picture>
  )
}
