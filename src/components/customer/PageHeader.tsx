import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

/** Panoramic fireworks skyline (legacy). */
export const HERO_HEADER_BG = SHANMUGA_BRAND.aboutHeaderBg

/** Festive Diwali illustration — default for all page heroes. */
export const FESTIVE_HEADER_BG = SHANMUGA_BRAND.festiveHeaderBg

export const HERO_HEADER_OVERLAY =
  'bg-gradient-to-b from-[#0F2847]/45 via-[#002830]/35 to-[#0F2847]/55'

/** Lighter overlay for cart & liked-products sunset hero */
export const CART_LIKES_HEADER_OVERLAY =
  'bg-gradient-to-b from-[#0F2847]/40 via-[#0A1F38]/20 to-[#0F2847]/55'

interface PageHeaderBackgroundProps {
  imageOpacity?: number
  imageSrc?: string
  overlayClassName?: string
  className?: string
  withVignette?: boolean
}

/** Fireworks skyline + Prime teal overlay — use behind page heroes. */
export function PageHeaderBackground({
  imageOpacity = 1,
  imageSrc = FESTIVE_HEADER_BG,
  overlayClassName = HERO_HEADER_OVERLAY,
  className,
  withVignette = true,
}: PageHeaderBackgroundProps) {
  return (
    <>
      <OptimizedBackground
        src={imageSrc}
        priority
        style={{ opacity: imageOpacity }}
        className={className}
      />
      <div className={cn('absolute inset-0', overlayClassName)} aria-hidden="true" />
      {withVignette && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(0,77,85,0.25),transparent_65%)]"
          aria-hidden="true"
        />
      )}
    </>
  )
}

interface PageHeaderProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  as?: 'header' | 'section'
  imageOpacity?: number
  imageSrc?: string
  overlayClassName?: string
  withVignette?: boolean
}

export function PageHeader({
  children,
  className,
  contentClassName,
  as = 'header',
  imageOpacity,
  imageSrc,
  overlayClassName,
  withVignette,
}: PageHeaderProps) {
  const Tag = as

  return (
    <Tag className={cn('relative overflow-hidden border-b-2 border-[#0F2847]', underNavPullClass, className)}>
      <PageHeaderBackground
        imageOpacity={imageOpacity}
        imageSrc={imageSrc}
        overlayClassName={overlayClassName}
        withVignette={withVignette}
      />
      <div className={cn('relative', underNavTopPadClass, contentClassName)}>{children}</div>
    </Tag>
  )
}
