import type { ReactNode } from 'react'
import { CartLikesHero } from '@/components/customer/CartLikesHero'
import { CART_LIKES_PAGE_HERO_BG } from '@/lib/siteConfig'

/** @deprecated Use CART_LIKES_PAGE_HERO_BG — kept for imports that reference legacy names. */
export const HERO_HEADER_BG = CART_LIKES_PAGE_HERO_BG

/** @deprecated Use CART_LIKES_PAGE_HERO_BG — kept for imports that reference legacy names. */
export const FESTIVE_HEADER_BG = CART_LIKES_PAGE_HERO_BG

interface PageHeaderProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  /** @deprecated CartLikesHero always renders a header element. */
  as?: 'header' | 'section'
}

/** Sunset temple hero — same image and layout as Cart / Likes pages. */
export function PageHeader({ children, className, contentClassName }: PageHeaderProps) {
  return (
    <CartLikesHero className={className} contentClassName={contentClassName}>
      {children}
    </CartLikesHero>
  )
}

/** @deprecated Use CartLikesHero directly. */
export function PageHeaderBackground() {
  return null
}
