import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { AUTH_LOGIN_CARD_WIDTH } from '@/lib/authLayout'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

interface LoginSplitLayoutProps {
  children?: ReactNode
  loading?: boolean
  /** Place the login card on the left (admin) or right (customer). */
  cardSide?: 'left' | 'right'
  showHeroText?: boolean
  heroTitle?: string
  heroSubtitle?: string
  cardMaxWidth?: string
}

const heroTextShadow =
  '[text-shadow:0_2px_20px_rgba(15,40,71,0.85),0_1px_4px_rgba(15,40,71,0.55)]'

export function LoginSplitLayout({
  children,
  loading = false,
  cardSide = 'right',
  showHeroText = true,
  heroTitle = 'Light up Happiness Together',
  heroSubtitle = 'Tradition · Celebration · Brighter Tomorrows',
  cardMaxWidth = AUTH_LOGIN_CARD_WIDTH,
}: LoginSplitLayoutProps) {
  const cardOnLeft = cardSide === 'left'

  return (
    <div className={cn('relative min-h-screen overflow-x-hidden', underNavPullClass)}>
      <OptimizedBackground
        src={SHANMUGA_BRAND.loginBg}
        priority
        className="fixed inset-0 z-0 h-screen"
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {showHeroText && (
          <div
            className={cn(
              'hidden flex-1 flex-col justify-end px-8 pb-14 lg:flex xl:px-12 xl:pb-16',
              underNavTopPadClass,
              cardOnLeft && 'order-2 items-end text-right',
            )}
          >
            <h2
              className={`max-w-md font-sans text-3xl font-bold leading-[1.15] text-white xl:text-[2.75rem] ${heroTextShadow}`}
            >
              {heroTitle}
            </h2>
            <p
              className={`mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white ${heroTextShadow}`}
            >
              {heroSubtitle}
            </p>
          </div>
        )}

        <div
          className={cn(
            'flex flex-1 items-center px-4 pb-10 sm:px-6 sm:pb-12',
            underNavTopPadClass,
            cardOnLeft
              ? 'order-1 justify-center lg:justify-start lg:pl-10 xl:pl-14'
              : 'justify-center lg:justify-end lg:pr-8 xl:pr-14',
          )}
        >
          {loading ? (
            <div className="flex h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <div className="mx-auto w-full min-w-0" style={{ maxWidth: cardMaxWidth, width: '100%' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
