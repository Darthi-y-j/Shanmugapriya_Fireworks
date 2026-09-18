import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

/** Full-page auth background — fixed image under the floating navbar. */
export function AuthPageBackground() {
  return (
    <OptimizedBackground
      src={SHANMUGA_BRAND.loginBg}
      priority
      className="fixed inset-0 z-0 h-screen"
    />
  )
}

export function AuthPageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('relative min-h-screen overflow-x-hidden', underNavPullClass)}>
      <AuthPageBackground />
      <div
        className={cn(
          'relative z-10 flex min-h-screen items-center justify-center px-4 pb-10 sm:px-6 sm:pb-12',
          underNavTopPadClass,
        )}
      >
        <div className={wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}>{children}</div>
      </div>
    </div>
  )
}

export function AuthCard({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#0F2847]/10 bg-white shadow-[0_12px_40px_rgba(0,77,85,0.12)] sm:mt-5">
      <OptimizedBackground src={SHANMUGA_BRAND.loginCardBg} priority />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.88)_35%,rgba(255,255,255,0.55)_100%)]"
        aria-hidden="true"
      />
      <div className={compact ? 'relative p-5 sm:p-6' : 'relative p-6 sm:p-8'}>{children}</div>
    </div>
  )
}

export const authInputClass =
  'w-full rounded-lg border border-[#0F2847]/15 bg-white px-3 py-2 text-sm focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30'
