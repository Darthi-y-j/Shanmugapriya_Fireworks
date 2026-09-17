import type { Category } from '@/types/database'

export interface CategoryMegaMenuGroup {
  title: string
  slugs: string[]
}

export const CATEGORY_MEGA_MENU_GROUPS: CategoryMegaMenuGroup[] = [
  {
    title: 'Sound Crackers',
    slugs: ['sound-party', 'zoom-boom', 'foil-bombs', 'paper-blast', 'bitli-fizzly', 'thunder'],
  },
  {
    title: 'Ground Spinners',
    slugs: ['cyclone-chakkars', 'spin-win', 'drive-wheels'],
  },
  {
    title: 'Fountains & Pots',
    slugs: [
      'flower-shower',
      'colour-kotis',
      'triangle-fountain',
      'rainbow-fountain',
      'shower-spark',
      'tun-tun-tun',
    ],
  },
  {
    title: 'Sparklers & Torches',
    slugs: ['twinkling-star', 'wonder-sparklers', 'crackling-torches', 'colour-matches'],
  },
  {
    title: 'Rockets & Skyshots',
    slugs: [
      'jet-rider',
      'star-shooter',
      'midnight-magic-skyshots',
      'special-colour-skyshots',
      'special-function-skyshots',
      'premium-plus-brands',
      'aerial-multishots',
      'elite-setout-fan-cake',
    ],
  },
  {
    title: 'Kids & Novelties',
    slugs: ['kids-friendly', 'peacock-dance', 'fantastic-novelties'],
  },
]

export interface ResolvedMegaMenuGroup {
  title: string
  categories: Category[]
}

export function resolveMegaMenuGroups(categories: Category[]): ResolvedMegaMenuGroup[] {
  const bySlug = new Map(categories.map((category) => [category.slug, category]))
  const usedIds = new Set<string>()

  const groups = CATEGORY_MEGA_MENU_GROUPS.map((group) => {
    const resolved = group.slugs
      .map((slug) => bySlug.get(slug))
      .filter((category): category is Category => Boolean(category))

    resolved.forEach((category) => usedIds.add(category.id))
    return { title: group.title, categories: resolved }
  }).filter((group) => group.categories.length > 0)

  const remaining = categories.filter((category) => !usedIds.has(category.id))
  if (remaining.length > 0) {
    groups.push({ title: 'More', categories: remaining })
  }

  return groups
}

export function distributeMegaMenuColumns(
  groups: ResolvedMegaMenuGroup[],
  columnCount = 4,
): ResolvedMegaMenuGroup[][] {
  const columns: ResolvedMegaMenuGroup[][] = Array.from({ length: columnCount }, () => [])
  groups.forEach((group, index) => {
    columns[index % columnCount].push(group)
  })
  return columns
}
