/** Returns trimmed brand label for display, or null when empty. */
export function getDisplayBrand(brand?: string | null): string | null {
  const name = brand?.trim()
  return name || null
}
