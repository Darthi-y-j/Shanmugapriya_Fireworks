import type { LucideIcon } from 'lucide-react'
import { Users, Clock, Award, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

const stats: {
  icon: LucideIcon
  value: string
  label: string
  shortLabel: string
  accent: string
}[] = [
  { icon: Users, value: '5000+', label: 'Happy Customers', shortLabel: 'Customers', accent: 'from-gold-400/45 to-gold-600/10' },
  { icon: Award, value: '100%', label: 'Quality Assured', shortLabel: 'Quality', accent: 'from-festive-400/40 to-gold-500/10' },
  { icon: Clock, value: '24/7', label: 'WhatsApp Support', shortLabel: 'Support', accent: 'from-gold-300/45 to-amber-600/10' },
  { icon: Package, value: '4+', label: 'Years Experience', shortLabel: 'Years', accent: 'from-gold-400/40 to-navy-800/15' },
]

export function HeroStats({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const isLight = variant === 'light'

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-1000 sm:-inset-4',
          isLight
            ? 'bg-gradient-to-r from-festive-500/10 via-gold-500/8 to-festive-500/10'
            : 'bg-gradient-to-r from-gold-500/12 via-festive-500/8 to-gold-500/12',
        )}
        aria-hidden="true"
      />

      {/* Mobile — single compact strip, 4 columns */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border backdrop-blur-xl transition-colors duration-1000 sm:hidden',
          isLight
            ? 'border-navy-900/10 bg-white/80 shadow-[0_12px_32px_rgba(12,8,6,0.08)]'
            : 'border-gold-500/20 bg-gradient-to-br from-navy-900/80 via-[#2a1a12]/75 to-navy-950/85 shadow-[inset_0_1px_0_rgba(251,191,36,0.1),0_12px_32px_rgba(12,8,6,0.35)]',
        )}
      >
        <div className={cn('grid grid-cols-4 divide-x', isLight ? 'divide-navy-900/10' : 'divide-gold-500/15')}>
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-1.5 py-3 text-center">
              <stat.icon className={cn('mb-1.5 h-4 w-4', isLight ? 'text-festive-500' : 'text-gold-300')} />
              <p className={cn('font-display text-sm font-bold leading-none', isLight ? 'text-navy-900' : 'text-cream-50')}>
                {stat.value}
              </p>
              <p
                className={cn(
                  'mt-1 text-[9px] font-medium uppercase leading-tight tracking-wide',
                  isLight ? 'text-navy-700/70' : 'text-gold-300/60',
                )}
              >
                {stat.shortLabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — full glass strip */}
      <div
        className={cn(
          'relative hidden grid-cols-4 gap-0 overflow-hidden rounded-2xl border backdrop-blur-2xl transition-colors duration-1000 sm:grid',
          isLight
            ? 'border-navy-900/10 bg-white/80 shadow-[0_24px_64px_rgba(12,8,6,0.08)]'
            : 'border-gold-500/20 bg-gradient-to-br from-navy-900/75 via-[#2a1a12]/70 to-navy-950/80 shadow-[inset_0_1px_0_rgba(251,191,36,0.12),0_24px_64px_rgba(12,8,6,0.4)]',
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'group relative overflow-hidden border-r p-5 last:border-r-0',
              isLight ? 'border-navy-900/10' : 'border-gold-500/15',
            )}
          >
            <div
              className={cn(
                'absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent to-transparent transition-transform duration-500 group-hover:scale-x-100',
                isLight ? 'via-festive-500/60' : 'via-gold-400/80',
              )}
              aria-hidden="true"
            />

            <div
              className={cn(
                `pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.accent} blur-2xl opacity-80 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100`,
              )}
              aria-hidden="true"
            />

            <div className="relative flex items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    'relative flex h-12 w-12 items-center justify-center rounded-full border shadow-[inset_0_1px_0_rgba(251,191,36,0.18)]',
                    isLight
                      ? 'border-festive-500/20 bg-gradient-to-br from-cream-100 to-white'
                      : 'border-gold-400/35 bg-gradient-to-br from-navy-800 to-[#1f1410]',
                  )}
                >
                  <stat.icon className={cn('h-5 w-5', isLight ? 'text-festive-500' : 'text-gold-300')} />
                </div>
              </div>

              <div className="min-w-0">
                <p className={cn('font-display text-2xl font-bold tracking-tight', isLight ? 'text-navy-900' : 'text-cream-50')}>
                  {stat.value}
                </p>
                <p
                  className={cn(
                    'truncate text-[11px] font-medium uppercase tracking-[0.12em]',
                    isLight ? 'text-navy-700/70' : 'text-gold-300/65',
                  )}
                >
                  {stat.label}
                </p>
              </div>
            </div>

            {index < stats.length - 1 && (
              <div
                className={cn(
                  'pointer-events-none absolute -right-px top-1/2 h-8 w-px -translate-y-1/2 bg-gradient-to-b from-transparent to-transparent',
                  isLight ? 'via-navy-900/15' : 'via-gold-400/35',
                )}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
