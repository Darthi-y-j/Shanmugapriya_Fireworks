import type { LucideIcon } from 'lucide-react'
import {
  Sparkles,
  Rocket,
  CircleDot,
  Flower2,
  Droplets,
  Gift,
  Package,
  LayoutGrid,
} from 'lucide-react'

const slugIconMap: Record<string, LucideIcon> = {
  sparklers: Sparkles,
  'aerial-shells': Rocket,
  'ground-chakkars': CircleDot,
  'flower-pots': Flower2,
  rockets: Rocket,
  fountains: Droplets,
  novelty: Gift,
  'novelty-items': Gift,
  'combo-packs': Package,
  combos: Package,
}

export function getCategoryIcon(slug: string, name: string): LucideIcon {
  const key = slug.toLowerCase()
  if (slugIconMap[key]) return slugIconMap[key]

  const lower = name.toLowerCase()
  if (lower.includes('sparkler')) return Sparkles
  if (lower.includes('aerial') || lower.includes('shell')) return Rocket
  if (lower.includes('chakkar') || lower.includes('ground')) return CircleDot
  if (lower.includes('flower')) return Flower2
  if (lower.includes('rocket')) return Rocket
  if (lower.includes('fountain')) return Droplets
  if (lower.includes('novelty')) return Gift
  if (lower.includes('combo')) return Package

  return LayoutGrid
}
