import type { Product } from '@/types/database'

export const HERO_SELECTION_LABEL = 'Popular'
export const HERO_SELECTION_CTA = 'View all popular'

function heroSelectionScore(product: Product): number {
  let score = 0
  if (product.is_best_seller) score += 100
  if (product.is_recommended) score += 60
  if (product.is_featured) score += 30
  if (product.discount_percentage != null && product.discount_percentage > 0) score += 20
  if (product.is_available) score += 10
  return score
}

/** Products for the homepage Popular strip — featured only, ranked by badges. */
export function pickHeroSelectionProducts(products: Product[], limit = 8): Product[] {
  return [...products]
    .filter((product) => product.is_featured && product.is_available !== false)
    .sort((a, b) => {
      const scoreDiff = heroSelectionScore(b) - heroSelectionScore(a)
      if (scoreDiff !== 0) return scoreDiff
      return a.sort_order - b.sort_order
    })
    .slice(0, limit)
}
