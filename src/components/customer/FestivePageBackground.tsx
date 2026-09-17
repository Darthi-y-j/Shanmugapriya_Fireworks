import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { cn } from '@/lib/utils'

interface FestivePageBackgroundProps {
  children: ReactNode
  className?: string
}

export function FestivePageBackground({ children, className }: FestivePageBackgroundProps) {
  return (
    <div className={cn('relative min-h-[calc(100vh-10rem)]', className)}>
      <OptimizedBackground src={SHANMUGA_BRAND.accountBg} priority />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/72 via-white/58 to-white/78"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
