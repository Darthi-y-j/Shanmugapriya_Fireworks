import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SectionAccent } from '@/lib/productCardThemes'
import { TitleHighlight } from './TitleHighlight'

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
  align?: 'left' | 'center'
  icon?: LucideIcon
  badge?: string
  showAccent?: boolean
  theme?: 'light' | 'dark'
  accent?: SectionAccent
  /** Orbitron on home page; default Playfair Display elsewhere */
  titleFont?: 'brand' | 'display'
}

function getHighlightVariant(theme: 'light' | 'dark', accent: SectionAccent) {
  if (theme === 'dark') return 'dark' as const
  if (accent === 'silver') return 'silver' as const
  if (accent === 'premium-plus') return 'premium-plus' as const
  if (accent === 'premium') return 'premium' as const
  return 'light' as const
}

const ACCENT_LINE: Record<SectionAccent, string> = {
  gold: 'bg-gradient-to-r from-festive-500 to-gold-400',
  premium: 'bg-gradient-to-r from-amber-800 to-festive-600',
  'premium-plus': 'bg-[linear-gradient(90deg,#8a6b12_0%,#e8c547_50%,#8a6b12_100%)]',
  silver: 'bg-gradient-to-r from-slate-600 to-cyan-600',
}

const ACCENT_LABEL: Record<SectionAccent, string> = {
  gold: 'text-festive-500',
  premium: 'text-amber-900',
  'premium-plus': 'text-amber-950',
  silver: 'text-slate-700',
}

const ACCENT_ICON: Record<SectionAccent, string> = {
  gold: 'text-gold-500',
  premium: 'text-festive-700',
  'premium-plus': 'text-amber-800',
  silver: 'text-cyan-600',
}

const ACCENT_DOT_SECONDARY: Record<SectionAccent, string> = {
  gold: 'bg-gold-400/70',
  premium: 'bg-festive-600/70',
  'premium-plus': 'bg-amber-500/70',
  silver: 'bg-cyan-400/70',
}

const ACCENT_DOT_TERTIARY: Record<SectionAccent, string> = {
  gold: 'bg-gold-400/40',
  premium: 'bg-festive-500/40',
  'premium-plus': 'bg-amber-400/40',
  silver: 'bg-slate-400/40',
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  icon: Icon,
  badge,
  showAccent = true,
  theme = 'light',
  accent = 'gold',
  titleFont = 'display',
}: SectionHeaderProps) {
  const titleFontClass = titleFont === 'brand' ? 'font-brand' : 'font-display'
  const isCenter = align === 'center'
  const isDark = theme === 'dark'
  const titleColor = isDark ? 'text-cream-50' : 'text-navy-900'
  const descColor = isDark ? 'text-cream-100/70' : 'text-navy-700/75'
  const highlightVariant = getHighlightVariant(theme, accent)
  const badgeColor = isDark
    ? 'border-gold-400/30 bg-gold-500/15 text-gold-300'
    : 'border-gold-500/25 bg-gold-500/10 text-gold-600'

  return (
    <div className={cn('relative', isCenter && 'text-center')}>
      {/* Label row */}
      <div
        className={cn(
          'flex items-center gap-2.5',
          isCenter ? 'justify-center' : '',
        )}
      >
        {!isCenter && (
          <span
            className={cn('h-0.5 w-10 shrink-0 rounded-full sm:w-14', ACCENT_LINE[accent])}
            aria-hidden="true"
          />
        )}
        {isCenter && (
          <span
            className="hidden h-px flex-1 max-w-20 bg-gradient-to-r from-transparent via-gold-400/50 to-festive-500/40 sm:block"
            aria-hidden="true"
          />
        )}
        <p
          className={cn(
            'flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.24em]',
            isCenter
              ? accent === 'silver'
                ? 'rounded-full border border-cyan-400/20 bg-gradient-to-r from-slate-400/10 via-cyan-400/8 to-slate-300/10 px-3 py-1.5 text-slate-600 shadow-[0_2px_14px_rgba(34,211,238,0.1)]'
                : accent === 'premium-plus'
                  ? 'rounded-full border border-amber-700/25 bg-gradient-to-r from-amber-500/10 via-yellow-500/8 to-amber-400/10 px-3 py-1.5 text-amber-950 shadow-[0_2px_14px_rgba(180,130,20,0.12)]'
                  : accent === 'premium'
                    ? 'rounded-full border border-festive-600/20 bg-gradient-to-r from-festive-600/10 via-amber-600/8 to-festive-500/10 px-3 py-1.5 text-amber-900 shadow-[0_2px_14px_rgba(180,83,9,0.1)]'
                    : 'rounded-full border border-festive-500/25 bg-gradient-to-r from-festive-500/12 via-gold-500/10 to-gold-400/12 px-3 py-1.5 text-festive-600 shadow-[0_2px_14px_rgba(234,88,12,0.12)]'
              : ACCENT_LABEL[accent],
          )}
        >
          {Icon && (
            <Icon
              className={cn('h-3.5 w-3.5', ACCENT_ICON[accent])}
              strokeWidth={2.5}
            />
          )}
          {label}
        </p>
        {badge && (
          <span className={cn('rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider', badgeColor)}>
            {badge}
          </span>
        )}
        {isCenter && (
          <span
            className="hidden h-px flex-1 max-w-20 bg-gradient-to-l from-transparent via-gold-400/50 to-festive-500/40 sm:block"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Title */}
      <h2
        className={cn(
          'mt-3 text-[1.65rem] font-bold leading-[1.15] sm:mt-4 sm:text-4xl sm:leading-tight',
          titleFontClass,
          isCenter && 'mx-auto',
        )}
      >
        {isCenter ? (
          (() => {
            const words = title.split(' ')
            const highlightCount = words.length >= 4 ? 3 : words.length > 1 ? 2 : 1
            if (words.length <= highlightCount) {
              return (
                <TitleHighlight variant={highlightVariant}>{title}</TitleHighlight>
              )
            }
            return (
              <>
                <span className={titleColor}>{words.slice(0, -highlightCount).join(' ')} </span>
                <TitleHighlight variant={highlightVariant}>
                  {words.slice(-highlightCount).join(' ')}
                </TitleHighlight>
              </>
            )
          })()
        ) : (() => {
          const bySplit = title.match(/^(.+\sby\s)(.+)$/i)
          if (bySplit) {
            return (
              <>
                <span className={titleColor}>{bySplit[1]}</span>
                <TitleHighlight variant={highlightVariant}>{bySplit[2]}</TitleHighlight>
              </>
            )
          }
          const words = title.split(' ')
          if (words.length > 1) {
            return (
              <>
                <span className={titleColor}>{words.slice(0, -1).join(' ')} </span>
                <TitleHighlight variant={highlightVariant}>{words.at(-1)}</TitleHighlight>
              </>
            )
          }
          return (
            <TitleHighlight variant={highlightVariant}>{title}</TitleHighlight>
          )
        })()}
      </h2>

      {description && (
        <p
          className={cn(
            'mt-3 max-w-lg text-sm leading-relaxed sm:mt-4',
            descColor,
            isCenter && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </p>
      )}

      {/* Decorative accent */}
      {showAccent && (
        <div
          className={cn(
            'mt-4 flex items-center gap-2 sm:mt-5',
            isCenter ? 'justify-center' : '',
          )}
          aria-hidden="true"
        >
          {!isCenter && (
            <>
              <span className={cn('h-1 w-10 rounded-full', ACCENT_LINE[accent])} />
              <span className={cn('h-1 w-2 rounded-full', ACCENT_DOT_SECONDARY[accent])} />
              <span className={cn('h-1 w-1 rounded-full', ACCENT_DOT_TERTIARY[accent])} />
            </>
          )}
          {isCenter && (
            <>
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold-400/45 sm:w-10" />
              <span className="h-1.5 w-12 rounded-full bg-gradient-to-r from-festive-500 via-gold-400 to-gold-300 shadow-[0_0_16px_rgba(245,158,11,0.35)] sm:w-16" />
              <span className="h-2 w-2 rotate-45 rounded-[2px] bg-gradient-to-br from-festive-400 to-gold-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="h-1 w-1 rounded-full bg-gold-400/80" />
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold-400/45 sm:w-10" />
            </>
          )}
        </div>
      )}
    </div>
  )
}
