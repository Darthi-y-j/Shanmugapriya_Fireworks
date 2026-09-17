import { cn, getImageUrl } from '@/lib/utils'

interface ProductBrandBadgeProps {
  brand?: string | null
  variant?: 'overlay' | 'dark' | 'light' | 'silver' | 'elite' | 'table'
  /** Allow long names to wrap up to 2 lines instead of truncating */
  wrap?: boolean
  className?: string
}

const TABLE_BRAND_THEMES = [
  {
    shell:
      'border-orange-300/55 bg-white shadow-[0_2px_10px_rgba(234,88,12,0.14)]',
    text: 'text-festive-700',
  },
  {
    shell:
      'border-gold-400/50 bg-gradient-to-br from-gold-50 via-white to-[#fff8ef] shadow-[0_2px_10px_rgba(245,158,11,0.16)]',
    text: 'text-amber-900',
  },
  {
    shell:
      'border-festive-500/30 bg-gradient-to-r from-festive-500/10 via-white to-gold-500/12 shadow-sm',
    text: 'text-festive-700',
  },
  {
    shell: 'border-amber-200/90 bg-[#fff5e8] shadow-sm',
    text: 'text-navy-900',
  },
  {
    shell:
      'border-orange-400/40 bg-gradient-to-r from-festive-500/12 to-gold-400/18 shadow-[0_2px_8px_rgba(234,88,12,0.1)]',
    text: 'text-navy-950',
  },
  {
    shell: 'border-stone-200/90 bg-cream-50 shadow-sm',
    text: 'text-stone-700',
  },
] as const

function getBrandThemeIndex(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % TABLE_BRAND_THEMES.length
  }
  return hash
}

function isBrandLogoUrl(value: string): boolean {
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/')
  ) {
    return (
      /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value) ||
      value.includes('/storage/') ||
      value.includes('/object/')
    )
  }
  return false
}

export function ProductBrandBadge({
  brand,
  variant = 'dark',
  wrap = false,
  className,
}: ProductBrandBadgeProps) {
  const name = brand?.trim()
  if (!name) return null

  const isLogo = variant === 'table' && isBrandLogoUrl(name)
  const tableTheme =
    variant === 'table' ? TABLE_BRAND_THEMES[getBrandThemeIndex(name)] : null

  return (
    <span
      title={name}
      className={cn(
        'max-w-full font-bold',
        variant === 'table' || variant === 'overlay' || variant === 'dark'
          ? 'normal-case tracking-normal'
          : 'uppercase tracking-wide',
        wrap
          ? 'line-clamp-2 inline-block w-max max-w-full whitespace-normal rounded-lg border px-2 py-1 text-left text-[9px] leading-snug sm:text-[10px]'
          : variant === 'table'
            ? 'inline-flex w-fit min-w-0 max-w-full items-center rounded-2xl border px-2 py-1 text-[9px] leading-snug sm:px-2.5 sm:text-[10px]'
            : variant === 'overlay' || variant === 'dark'
              ? 'inline-flex w-max max-w-full items-center justify-center whitespace-nowrap rounded-full border px-2 py-1 text-[8px] normal-case leading-none tracking-normal sm:px-2.5 sm:text-[10px]'
              : 'inline-flex w-max max-w-full items-center justify-center truncate rounded-full border px-2 py-1 text-[9px] leading-none sm:px-2.5 sm:text-[10px]',
        variant === 'table' &&
          cn(
            'rounded-2xl border px-2.5 py-1.5 normal-case tracking-normal shadow-sm',
            isLogo ? 'max-w-[6.5rem]' : '',
            wrap && 'line-clamp-2 whitespace-normal',
            tableTheme?.shell,
            !isLogo && tableTheme?.text,
          ),
        variant === 'overlay' &&
          'border-amber-200/80 bg-black/85 text-amber-50 shadow-[0_2px_12px_rgba(0,0,0,0.55)] backdrop-blur-md',
        variant === 'dark' &&
          'border-amber-200/75 bg-black/80 text-amber-50 shadow-[0_2px_10px_rgba(0,0,0,0.45)] backdrop-blur-sm',
        variant === 'light' &&
          'border-gold-500/35 bg-gold-500/15 text-festive-600',
        variant === 'silver' &&
          'border-slate-300/45 bg-slate-400/15 text-slate-200',
        variant === 'elite' &&
          'border-slate-300/40 bg-indigo-500/12 text-slate-100',
        className,
      )}
    >
      {isLogo ? (
        <img
          src={getImageUrl(name)}
          alt=""
          className="max-h-9 max-w-full object-contain sm:max-h-10"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="min-w-0 truncate">{name}</span>
      )}
    </span>
  )
}
