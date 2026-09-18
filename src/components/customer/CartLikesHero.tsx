import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { CART_LIKES_PAGE_HERO_BG } from '@/lib/siteConfig'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

/** Pull page content under the floating Prime header (matches About page). */
export function CartLikesPageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative overflow-x-hidden bg-white', underNavPullClass, className)}>
      {children}
    </div>
  )
}

const heroContentPadding = cn('pb-8 sm:pb-10', underNavTopPadClass)

export const cartLikesHeroTitleClass =
  'font-sans text-3xl font-bold leading-tight text-white [text-shadow:0_2px_14px_rgba(15,40,71,0.65)] sm:text-4xl lg:text-5xl'

export const cartLikesHeroTitleCompactClass =
  'font-sans text-2xl font-bold leading-tight text-white [text-shadow:0_2px_14px_rgba(15,40,71,0.65)] sm:text-3xl'

export const cartLikesHeroAccentClass =
  'text-white [text-shadow:0_2px_10px_rgba(15,40,71,0.55)]'

export const cartLikesHeroIconAccentClass = 'text-white'

export const cartLikesHeroBreadcrumbClass =
  'flex items-center justify-center gap-2 text-xs text-white/80'

export const cartLikesHeroBreadcrumbCurrentClass = 'font-semibold text-white'

export const cartLikesHeroMutedClass =
  'text-sm leading-relaxed text-white/90 [text-shadow:0_1px_8px_rgba(15,40,71,0.5)] sm:text-base'

export const cartLikesHeroBadgeClass =
  'inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#0F2847]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white'

export const cartLikesHeroChipClass =
  'inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm'

interface CartLikesHeroProps {
  children: ReactNode
  className?: string
  contentClassName?: string
}

/** Sunset temple hero — direct image so it shows without a WebP sibling. */
export function CartLikesHero({ children, className, contentClassName }: CartLikesHeroProps) {
  return (
    <header
      className={cn(
        'relative min-h-[260px] overflow-hidden border-b-2 border-[#0F2847] sm:min-h-[300px]',
        className,
      )}
    >
      <OptimizedBackground
        src={CART_LIKES_PAGE_HERO_BG}
        priority
        imgClassName="object-[center_top]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0F2847]/50 via-[#0F2847]/25 to-[#0F2847]/55"
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8',
          heroContentPadding,
          contentClassName,
        )}
      >
        {children}
      </div>
    </header>
  )
}
