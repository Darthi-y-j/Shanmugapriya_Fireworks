export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(price: number | null | undefined): string | null {
  if (price === null || price === undefined) return null
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPieces(pieces: number | null | undefined): string | null {
  if (pieces == null || pieces < 1) return null
  return `${pieces} piece${pieces !== 1 ? 's' : ''}`
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value))
}

/** enquiries.product_id is a FK to products — non-UUID or stale IDs must be omitted. */
export function sanitizeEnquiryProductId(productId: string | null | undefined): string | null {
  return isValidUuid(productId) ? productId! : null
}

export function generateEnquiryNumber(): string {
  const date = new Date()
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ENQ-${datePart}-${random}`
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const SUPABASE_OBJECT_PATH = '/storage/v1/object/public/'
const SUPABASE_RENDER_PATH = '/storage/v1/render/image/public/'

/** Display widths — request 2x for retina where noted in usage */
export const IMAGE_WIDTH = {
  thumb: 160,
  card: 480,
  detail: 960,
} as const

export function getImageUrl(
  url: string | null | undefined,
  fallback = '/placeholder-product.svg',
  width?: number,
  height?: number,
  resize: 'cover' | 'contain' = 'cover',
): string {
  if (!url) return fallback
  if (!width || !url.includes(SUPABASE_OBJECT_PATH)) return url

  const renderUrl = url.replace(SUPABASE_OBJECT_PATH, SUPABASE_RENDER_PATH)
  const h = height ?? Math.round((width * 3) / 4)
  const quality = width <= IMAGE_WIDTH.thumb ? 70 : width <= IMAGE_WIDTH.card ? 75 : 80
  return `${renderUrl}?width=${width}&height=${h}&quality=${quality}&resize=${resize}`
}

/** 4:4 (1:1) category artwork from Supabase — never crop to 4:3 */
export function getSquareImageUrl(
  url: string | null | undefined,
  fallback = '/placeholder-category.svg',
  size: number = IMAGE_WIDTH.card,
): string {
  return getImageUrl(url, fallback, size, size, 'contain')
}
