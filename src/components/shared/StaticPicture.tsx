import { assetWithWebp } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface StaticPictureProps {
  src: string
  alt?: string
  className?: string
  imgClassName?: string
  priority?: boolean
}

/** Local public-folder image with automatic WebP + no fade-in. */
export function StaticPicture({
  src,
  alt = '',
  className,
  imgClassName,
  priority = false,
}: StaticPictureProps) {
  const { webp, fallback } = assetWithWebp(src)

  return (
    <picture className={className}>
      <source type="image/webp" srcSet={webp} />
      <img
        src={fallback}
        alt={alt}
        decoding={priority ? 'sync' : 'async'}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn(imgClassName)}
      />
    </picture>
  )
}
