/** Normalize user input — uppercase, no spaces. */
export function normalizeReferralCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

/** Parse admin settings (one code per line or comma-separated). */
export function parseReferralCodeList(raw: string | string[] | undefined): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((code) => normalizeReferralCode(code)).filter(Boolean)
  }
  return raw
    .split(/[\n,]+/)
    .map((code) => normalizeReferralCode(code))
    .filter(Boolean)
}

export function isReferralCodeValid(code: string, allowedCodes: string[]): boolean {
  const normalized = normalizeReferralCode(code)
  if (!normalized) return true
  if (allowedCodes.length === 0) return true
  return allowedCodes.includes(normalized)
}

export function formatReferralCodesForStorage(codes: string[]): string[] {
  return [...new Set(codes.map((code) => normalizeReferralCode(code)).filter(Boolean))]
}
