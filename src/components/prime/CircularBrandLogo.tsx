import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { cn } from '@/lib/utils'

type CircularBrandLogoProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
}

export function CircularBrandLogo({
  src,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
}: CircularBrandLogoProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white',
        className,
      )}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className={cn('h-full w-full object-contain', imgClassName)}
        loading={loading}
        priority={loading === 'eager'}
      />
    </div>
  )
}
