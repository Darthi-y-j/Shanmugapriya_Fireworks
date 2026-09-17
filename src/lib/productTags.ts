export const PRODUCT_TAG_OPTIONS = [
  { value: 'Premium', label: 'Premium' },
  { value: 'Premium Plus', label: 'Premium+' },
  { value: 'Elite Setout', label: 'Elite' },
  { value: 'Special Function Skyshots', label: 'Skyworks for Function' },
  { value: 'Special Colors Skyshot', label: 'Skyworks for Colors' },
] as const

export const PRODUCT_TAGS = PRODUCT_TAG_OPTIONS.map((option) => option.value)

export type ProductTag = (typeof PRODUCT_TAGS)[number]

/** Tags rendered as badges on product cards — category label hidden when present */
export const CARD_VISIBLE_PRODUCT_TAGS = new Set<ProductTag>([
  'Premium',
  'Premium Plus',
  'Elite Setout',
])

export function isCardVisibleProductTag(tag: string | null | undefined): boolean {
  return CARD_VISIBLE_PRODUCT_TAGS.has(tag?.trim() as ProductTag)
}

export function getProductTagLabel(tag: string): string {
  return PRODUCT_TAG_OPTIONS.find((option) => option.value === tag)?.label ?? tag
}
