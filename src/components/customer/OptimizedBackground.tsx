import { useLayoutEffect, type CSSProperties } from 'react'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedBackgroundProps {
  src: string
  alt?: string
  /** Eager load + preload (default true — backgrounds should appear without pop-in). */
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
}

/**
 * Decorative full-bleed background using WebP with PNG/JPG fallback.
 * CSS background paints as soon as the image is cached (no img decode wait).
 */
export function OptimizedBackground({
  src,
  alt = '',
  priority = true,
  className,
  imgClassName,
  style,
}: OptimizedBackgroundProps) {
  const { webp, fallback } = assetWithWebp(src)

  useLayoutEffect(() => {
    if (priority) preloadImage(webp)
  }, [priority, webp])

  const backgroundStyle: CSSProperties = {
    ...style,
    backgroundImage: `image-set(url("${webp}") type("image/webp"), url("${fallback}") type("image/png"))`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden bg-[#f6f3ef]', className)}
      aria-hidden={!alt}
      style={backgroundStyle}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      {/* Hidden img helps Safari cache WebP and improves accessibility when alt is set */}
      <img
        src={webp}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('absolute h-px w-px overflow-hidden opacity-0', imgClassName)}
      />
    </div>
  )
}
