export function getNextSortOrder(items: { sort_order?: number | null }[]): number {
  if (items.length === 0) return 1
  const max = Math.max(...items.map((item) => item.sort_order ?? 0))
  return max + 1
}

export function isSortOrderTaken(
  items: { id?: string; sort_order?: number | null }[],
  sortOrder: number,
  excludeId?: string
): boolean {
  return items.some(
    (item) => item.id !== excludeId && (item.sort_order ?? 0) === sortOrder
  )
}

export function getSortOrderConflictMessage(
  items: { id?: string; name?: string; sort_order?: number | null }[],
  sortOrder: number,
  excludeId?: string
): string | null {
  const conflict = items.find(
    (item) => item.id !== excludeId && (item.sort_order ?? 0) === sortOrder
  )
  if (!conflict) return null
  const label = conflict.name ? `"${conflict.name}"` : 'another item'
  return `Sort order ${sortOrder} is already used by ${label}.`
}

export function reorderItems<T extends { id: string }>(items: T[], fromId: string, toId: string): T[] {
  const fromIndex = items.findIndex((item) => item.id === fromId)
  const toIndex = items.findIndex((item) => item.id === toId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return items

  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function withSequentialSortOrder<T extends { sort_order?: number | null }>(
  items: T[]
): (T & { sort_order: number })[] {
  return items.map((item, index) => ({
    ...item,
    sort_order: index + 1,
  }))
}
