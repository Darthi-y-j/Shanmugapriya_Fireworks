import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const accentStyles = {
  default: 'from-navy-900/8 to-navy-900/4 text-navy-700',
  gold: 'from-gold-500/15 to-gold-400/5 text-gold-700',
  festive: 'from-festive-500/15 to-festive-400/5 text-festive-600',
  green: 'from-emerald-500/15 to-emerald-400/5 text-emerald-700',
  blue: 'from-blue-500/15 to-blue-400/5 text-blue-700',
  violet: 'from-violet-500/15 to-violet-400/5 text-violet-700',
} as const

interface DashboardCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: string
  accent?: keyof typeof accentStyles
  className?: string
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  trend,
  accent = 'default',
  className,
}: DashboardCardProps) {
  return (
    <div className={cn('admin-card group flex h-full flex-col p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg', className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm',
            accentStyles[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase leading-snug tracking-wide text-navy-700/55">{title}</p>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums text-navy-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-navy-700/45">{trend}</p>}
      </div>
    </div>
  )
}
