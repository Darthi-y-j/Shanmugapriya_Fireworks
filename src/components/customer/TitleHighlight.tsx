import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TitleHighlightProps {
  children: ReactNode
  /** `light` = general; `premium` / `premium-plus` / `silver` = tagged collections on white bg */
  variant?: 'light' | 'dark' | 'premium' | 'premium-plus' | 'silver'
  className?: string
}

/** Dual-tone gradient text — inline-block scopes the gradient to the word only. */
export function TitleHighlight({ children, variant = 'light', className }: TitleHighlightProps) {
  return (
    <span
      className={cn(
        'inline bg-clip-text text-transparent',
        variant === 'dark'
          ? 'bg-gradient-to-b from-festive-400 via-festive-500 to-navy-800'
          : variant === 'silver'
            ? 'bg-gradient-to-r from-slate-600 via-slate-500 to-festive-500'
            : variant === 'premium-plus'
              ? 'bg-[linear-gradient(90deg,#1565c0_0%,#42a5f5_48%,#1565c0_100%)]'
              : variant === 'premium'
                ? 'bg-gradient-to-r from-navy-900 via-festive-600 to-navy-800'
                : 'bg-gradient-to-br from-festive-500 via-gold-500 to-gold-400',
        className,
      )}
    >
      {children}
    </span>
  )
}
