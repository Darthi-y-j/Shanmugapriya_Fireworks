export const SELL_UNIT_SPEC_KEY = 'sell_unit'
export const UNITS_PER_ITEM_SPEC_KEY = 'units_per_item'
export const INNER_COUNT_SPEC_KEY = 'inner_count'
export const INNER_UNIT_NAME_SPEC_KEY = 'inner_unit_name'

const PACKAGING_SPEC_KEYS = [
  SELL_UNIT_SPEC_KEY,
  UNITS_PER_ITEM_SPEC_KEY,
  INNER_COUNT_SPEC_KEY,
  INNER_UNIT_NAME_SPEC_KEY,
] as const

export const SELL_UNITS = [
  { value: 'pack', label: 'Pack' },
  { value: 'box', label: 'Box' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'carton', label: 'Carton' },
  { value: 'piece', label: 'Piece (single item)' },
] as const

export type SellUnit = (typeof SELL_UNITS)[number]['value']

export function isSellUnit(value: string): value is SellUnit {
  return SELL_UNITS.some((unit) => unit.value === value)
}

export function hasNestedInnerUnit(sellUnit: string): boolean {
  return sellUnit === 'bundle' || sellUnit === 'carton'
}

export function getSellUnitLabel(value: string | null | undefined): string {
  const match = SELL_UNITS.find((unit) => unit.value === value)
  return match?.label ?? 'Pack'
}

export function getSellUnitNoun(value: string | null | undefined): string {
  const match = SELL_UNITS.find((unit) => unit.value === value)
  if (!match) return 'pack'
  if (match.value === 'piece') return 'piece'
  return match.label.toLowerCase()
}

function pluralize(word: string): string {
  const trimmed = word.trim().toLowerCase()
  if (!trimmed) return 'boxes'
  if (trimmed.endsWith('s')) return trimmed
  if (trimmed.endsWith('ch') || trimmed.endsWith('sh') || trimmed.endsWith('x') || trimmed.endsWith('z')) {
    return `${trimmed}es`
  }
  if (trimmed.endsWith('y') && !/[aeiou]y$/i.test(trimmed)) {
    return `${trimmed.slice(0, -1)}ies`
  }
  return `${trimmed}s`
}

export function getUnitsPerItemLabel(sellUnit: string): string {
  const noun = pluralize(getSellUnitNoun(sellUnit))
  return `Number of ${noun} per item`
}

export function getUnitsPerItemHelp(sellUnit: string): string {
  const noun = pluralize(getSellUnitNoun(sellUnit))
  return `How many ${noun} the customer gets in one unit (usually 1).`
}

export function getInnerCountLabel(sellUnit: string, innerUnitName: string): string {
  const inner = innerUnitName.trim() || 'box'
  return `${pluralize(inner)} per ${getSellUnitNoun(sellUnit)}`
}

export function getPiecesPerLabel(sellUnit: string, innerUnitName: string): string {
  if (hasNestedInnerUnit(sellUnit)) {
    return `Pieces per ${innerUnitName.trim() || 'box'}`
  }
  return `Pieces per ${getSellUnitNoun(sellUnit)}`
}

export function parseOptionalPositiveInt(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = parseInt(trimmed, 10)
  if (Number.isNaN(parsed) || parsed < 1) return null
  return parsed
}

export interface PackagingPreviewInput {
  sellUnit: string
  pieces: number | null
  unitsPerItem: number | null
  innerCount: number | null
  innerUnitName: string
}

export function formatPackagingLabel({
  sellUnit,
  pieces,
  unitsPerItem,
  innerCount,
  innerUnitName,
}: PackagingPreviewInput): string | null {
  if (sellUnit === 'piece') {
    return 'per piece'
  }

  const unit = getSellUnitNoun(sellUnit)
  const units = unitsPerItem ?? 1

  if (hasNestedInnerUnit(sellUnit)) {
    const inner = innerUnitName.trim() || 'box'
    const parts: string[] = []

    parts.push(units === 1 ? `1 ${unit}` : `${units} ${pluralize(unit)}`)

    if (innerCount != null && innerCount >= 1) {
      parts.push(`${innerCount} ${pluralize(inner)}`)
    }

    if (pieces != null && pieces >= 1) {
      parts.push(`${pieces} pcs/${inner}`)
    }

    return parts.length > 0 ? parts.join(' · ') : null
  }

  if (pieces == null || pieces < 1) {
    return null
  }

  return `${pieces} pcs per ${unit}`
}

export function formatPackagingPreview(input: PackagingPreviewInput): string {
  if (input.sellUnit === 'piece') {
    return 'Preview: sold per piece'
  }

  const unit = getSellUnitNoun(input.sellUnit)
  const label = formatPackagingLabel(input)

  if (label) {
    return `Preview: ${label}`
  }

  if (hasNestedInnerUnit(input.sellUnit)) {
    const inner = input.innerUnitName.trim() || 'box'
    if (input.innerCount == null || input.innerCount < 1) {
      return `Preview: enter ${pluralize(inner)} per ${unit}`
    }
    return `Preview: enter pcs/${inner}`
  }

  return `Preview: enter pieces per ${unit}`
}

export function formatProductPackagingLabel(
  product: { pieces: number | null; specifications: Record<string, string> | null },
): string | null {
  const packaging = readPackagingFromSpecifications(product.specifications)

  const label = formatPackagingLabel({
    sellUnit: packaging.sell_unit,
    pieces: product.pieces,
    unitsPerItem: parseOptionalPositiveInt(packaging.units_per_item),
    innerCount: parseOptionalPositiveInt(packaging.inner_count),
    innerUnitName: packaging.inner_unit_name,
  })

  if (label) return label

  if (product.pieces != null && product.pieces >= 1) {
    return `${product.pieces} pcs`
  }

  return null
}

export function specificationsWithoutPackaging(
  specifications: Record<string, string> | null | undefined,
): Record<string, string> {
  if (!specifications) return {}
  const rest = { ...specifications }
  for (const key of PACKAGING_SPEC_KEYS) {
    delete rest[key]
  }
  return rest
}

export function specificationsToTextarea(
  specifications: Record<string, string> | null | undefined,
): string {
  return Object.entries(specificationsWithoutPackaging(specifications))
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

export function readPackagingFromSpecifications(
  specifications: Record<string, string> | null | undefined,
): {
  sell_unit: SellUnit
  units_per_item: string
  inner_count: string
  inner_unit_name: string
} {
  const rawSellUnit = specifications?.[SELL_UNIT_SPEC_KEY]
  return {
    sell_unit: rawSellUnit && isSellUnit(rawSellUnit) ? rawSellUnit : 'pack',
    units_per_item: specifications?.[UNITS_PER_ITEM_SPEC_KEY] ?? '1',
    inner_count: specifications?.[INNER_COUNT_SPEC_KEY] ?? '',
    inner_unit_name: specifications?.[INNER_UNIT_NAME_SPEC_KEY] ?? 'box',
  }
}

export function buildPackagingSpecifications(
  sellUnit: SellUnit,
  unitsPerItem: number,
  innerCount: number | null,
  innerUnitName: string,
): Record<string, string> {
  const specs: Record<string, string> = {
    [SELL_UNIT_SPEC_KEY]: sellUnit,
    [UNITS_PER_ITEM_SPEC_KEY]: String(unitsPerItem),
  }

  if (hasNestedInnerUnit(sellUnit)) {
    if (innerCount != null) {
      specs[INNER_COUNT_SPEC_KEY] = String(innerCount)
    }
    const innerName = innerUnitName.trim() || 'box'
    specs[INNER_UNIT_NAME_SPEC_KEY] = innerName
  }

  return specs
}
