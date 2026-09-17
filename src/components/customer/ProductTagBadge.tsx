import { Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CARD_VISIBLE_PRODUCT_TAGS, type ProductTag } from '@/lib/productTags'
import { SILVER_METALLIC_BG } from '@/lib/productCardThemes'
interface ProductTagBadgeProps {
  tag?: string | null
  variant?: 'overlay' | 'dark' | 'light'
  className?: string
  /** Compact label for small card overlays */
  compact?: boolean
}

const VISIBLE_TAGS = CARD_VISIBLE_PRODUCT_TAGS

const GOLD_METALLIC =
  'bg-[linear-gradient(90deg,#8a6b12_0%,#c9a227_28%,#f9e076_50%,#c9a227_72%,#8a6b12_100%)]'

const TAG_STYLES: Record<
  Extract<ProductTag, 'Premium' | 'Premium Plus' | 'Elite Setout'>,
  {
    label: string
    compactLabel: string
    icon: typeof Crown
    overlay: string
    dark: string
    light: string
  }
> = {
  Premium: {
    label: 'Premium',
    compactLabel: 'Premium',
    icon: Crown,
    overlay:
      'border-gold-400/45 bg-navy-950/85 text-gold-300 shadow-[0_4px_14px_rgba(0,0,0,0.45)] backdrop-blur-md',
    dark: 'border-gold-400/40 bg-gold-500/12 text-gold-300',
    light: 'border-gold-500/30 bg-gold-500/8 text-festive-600',
  },
  'Premium Plus': {
    label: 'Premium Plus',
    compactLabel: 'Premium+',
    icon: Sparkles,
    overlay: cn(
      'border-[#c9a227]/70 text-black shadow-[0_4px_16px_rgba(212,175,55,0.4)]',
      GOLD_METALLIC,
    ),
    dark: cn('border-[#c9a227]/70 text-black', GOLD_METALLIC),
    light: cn('border-[#c9a227]/70 text-black', GOLD_METALLIC),
  },
  'Elite Setout': {
    label: 'Elite',
    compactLabel: 'Elite',
    icon: Crown,
    overlay: cn(
      'border-[#a8b0b8]/75 text-navy-950 shadow-[0_4px_16px_rgba(148,163,184,0.4)]',
      SILVER_METALLIC_BG,
    ),
    dark: cn('border-[#a8b0b8]/75 text-navy-950', SILVER_METALLIC_BG),
    light: cn('border-[#a8b0b8]/75 text-navy-950', SILVER_METALLIC_BG),
  },
}

function getTagStyle(tag: string) {
  if (!VISIBLE_TAGS.has(tag as ProductTag)) return null
  return TAG_STYLES[tag as keyof typeof TAG_STYLES] ?? null
}

export function ProductTagBadge({
  tag,
  variant = 'dark',
  className,
  compact = false,
}: ProductTagBadgeProps) {
  const name = tag?.trim()
  if (!name) return null

  const style = getTagStyle(name)
  if (!style) return null

  const Icon = style.icon
  const label = compact ? style.compactLabel : style.label

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:gap-1.5 sm:px-2.5 sm:text-[10px]',
        variant === 'overlay' && style.overlay,
        variant === 'dark' && style.dark,
        variant === 'light' && style.light,
        className,
      )}
    >
      <Icon className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={2.5} />
      {label}
    </span>
  )
}
