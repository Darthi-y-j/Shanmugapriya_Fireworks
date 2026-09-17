import type { ReactNode } from 'react'
import { AUTH_CARD_BG } from '@/lib/authLayout'
import { cn } from '@/lib/utils'

interface AuthFormCardProps {
  children: ReactNode
  className?: string
}

/** Login / register / admin card with mandala background. */
export function AuthFormCard({ children, className }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-[#C9A24A]/30 shadow-[0_12px_40px_rgba(15,40,71,0.18)]',
        className,
      )}
    >
      <img
        src={AUTH_CARD_BG}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
      <div className="relative z-10 px-5 py-5 text-[#F5F0E6] sm:px-7 sm:py-6">{children}</div>
    </div>
  )
}
