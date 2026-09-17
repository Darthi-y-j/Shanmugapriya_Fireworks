export const SILVER_METALLIC_BG =
  'bg-[linear-gradient(90deg,#3f444c_0%,#7a828c_24%,#f3f6f8_50%,#7a828c_76%,#3f444c_100%)]'

/** Featured marquee cards — warm bronze into deep charcoal */
export const FEATURED_CARD_GRADIENT = 'bg-gradient-to-r from-[#43302b] to-[#140f0d]'

/** Elite cards: silver primary + ice-blue secondary (mirrors gold + navy on Premium) */
export const ELITE_BORDER_GLOW =
  'bg-gradient-to-br from-slate-400/45 via-indigo-500/22 to-cyan-400/28'

export const ELITE_CARD_INNER =
  'bg-gradient-to-b from-navy-950 via-[#0b1220] to-navy-950'

export function isEliteProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Elite Setout'
}

export function isPremiumProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Premium'
}

export function isPremiumPlusProductTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Premium Plus'
}

export function isSkyworksFunctionTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Special Function Skyshots'
}

export function isSkyworksColorsTag(tag: string | null | undefined): boolean {
  return tag?.trim() === 'Special Colors Skyshot'
}

export function isSkyworksProductTag(tag: string | null | undefined): boolean {
  return isSkyworksFunctionTag(tag) || isSkyworksColorsTag(tag)
}

export function getCardDescriptionClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'text-slate-300/65'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'text-amber-100/55'
  }
  if (isPremiumProductTag(tag)) {
    return 'text-cream-100/60'
  }
  return 'text-cream-100/60'
}

export function getCardCategoryClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'text-cyan-400/45'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'text-amber-400/45'
  }
  if (isPremiumProductTag(tag)) {
    return 'text-festive-400/40'
  }
  return 'text-gold-400/45'
}

export function getCardTitleClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(34,211,238,0.28)] group-hover:from-white group-hover:via-cyan-50 group-hover:to-slate-100'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(251,191,36,0.4)] group-hover:from-amber-200 group-hover:via-yellow-100 group-hover:to-amber-50'
  }
  if (isPremiumProductTag(tag)) {
    return 'bg-gradient-to-r from-festive-400 via-gold-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.42)] group-hover:from-festive-300 group-hover:via-gold-200 group-hover:to-yellow-200'
  }
  if (isSkyworksProductTag(tag)) {
    return 'bg-gradient-to-r from-gold-300 via-gold-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)] group-hover:from-gold-200 group-hover:via-gold-300 group-hover:to-yellow-200'
  }
  return 'bg-gradient-to-r from-gold-300 via-gold-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)] group-hover:from-gold-200 group-hover:via-gold-300 group-hover:to-yellow-200'
}

/** Shared product title sizing + emphasis on cards */
export const CARD_TITLE_BASE_CLASS =
  'font-product-name text-[15px] font-extrabold leading-tight tracking-[0.01em] line-clamp-2 sm:text-[17px]'

export function getCardPricePanelClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'bg-gradient-to-r from-indigo-950/55 via-slate-900/45 to-cyan-950/35 ring-slate-400/15'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'bg-gradient-to-r from-amber-950/60 via-yellow-900/40 to-amber-950/50 ring-amber-400/22'
  }
  if (isPremiumProductTag(tag)) {
    return 'bg-gradient-to-r from-orange-950/65 via-festive-950/50 to-amber-950/55 ring-orange-400/22'
  }
  return 'bg-gradient-to-r from-navy-950/75 via-amber-950/35 to-navy-950/75 ring-gold-500/12'
}

export function getCardViewButtonClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) {
    return 'border-slate-400/25 text-slate-100 hover:border-cyan-400/35 hover:bg-cyan-950/25'
  }
  if (isPremiumPlusProductTag(tag)) {
    return 'border-amber-400/35 text-amber-200 hover:border-amber-300/50 hover:bg-amber-950/35'
  }
  if (isPremiumProductTag(tag)) {
    return 'border-orange-400/35 text-orange-200 hover:border-orange-300/50 hover:bg-orange-950/35'
  }
  return 'border-cream-100/12 text-cream-100/90 hover:border-gold-400/35 hover:bg-white/[0.04]'
}

const CARD_PERFORATION_DOT_GOLD =
  'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'

const CARD_PERFORATION_DOT_SILVER =
  'bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.45)]'

/** Ticket-style perforation dots between image and content panel */
export function getCardPerforationDotClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) return CARD_PERFORATION_DOT_SILVER
  return CARD_PERFORATION_DOT_GOLD
}

export function getCardPerforationLineClass(tag: string | null | undefined): string {
  if (isEliteProductTag(tag)) return 'border-cyan-400/28'
  if (isPremiumPlusProductTag(tag)) return 'border-amber-400/35'
  if (isPremiumProductTag(tag)) return 'border-orange-400/35'
  return 'border-gold-400/35'
}

export type SectionAccent = 'gold' | 'premium' | 'premium-plus' | 'silver'

export function getSectionAccentForTag(tag: string): SectionAccent {
  const normalized = tag.trim()
  if (normalized === 'Elite Setout') return 'silver'
  if (normalized === 'Premium Plus') return 'premium-plus'
  if (normalized === 'Premium') return 'premium'
  return 'gold'
}
