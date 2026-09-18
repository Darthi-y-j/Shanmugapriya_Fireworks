import type { CSSProperties } from 'react'
import { assetWithWebp } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedBackgroundProps {
  src: string
  alt?: string
  /** Eager load with high fetch priority — use for above-the-fold backgrounds. */
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
  /** cover = object-cover (default), fill = object-fill for stretched frames */
  fit?: 'cover' | 'fill' | 'contain'
}

/**
 * Full-bleed decorative background as a real <img> (not CSS background-image)
 * so the browser can discover, preload, and paint it immediately.
 */
export function OptimizedBackground({
  src,
  alt = '',
  priority = true,
  className,
  imgClassName,
  style,
  fit = 'cover',
}: OptimizedBackgroundProps) {
  const { webp, fallback } = assetWithWebp(src)
  const objectClass =
    fit === 'fill' ? 'object-fill' : fit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <picture
      className={cn('pointer-events-none absolute inset-0 overflow-hidden bg-[#f6f3ef]', className)}
      style={style}
      aria-hidden={!alt}
    >
      <source srcSet={webp} type="image/webp" />
      <img
        src={fallback}
        alt={alt}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full', objectClass, imgClassName)}
      />
    </picture>
  )
}
