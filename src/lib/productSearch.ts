import type { Product } from '@/types/database'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  const prev = new Array<number>(b.length + 1)
  const curr = new Array<number>(b.length + 1)

  for (let j = 0; j <= b.length; j++) prev[j] = j

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]
  }

  return prev[b.length]
}

function maxEditDistance(token: string): number {
  const len = token.length
  if (len <= 2) return 0
  if (len <= 4) return 1
  if (len <= 7) return 2
  return 3
}

function fuzzyWordMatch(token: string, word: string): boolean {
  if (!token || !word) return false
  if (word === token) return true
  if (word.includes(token) || token.includes(word)) return true

  const minLen = Math.min(token.length, word.length)
  if (minLen >= 3 && (word.startsWith(token) || token.startsWith(word))) return true

  const maxDist = maxEditDistance(token)
  if (maxDist === 0) return false

  if (levenshtein(token, word) <= maxDist) return true

  // Compare slightly shorter prefixes for longer words (e.g. "sparklr" → "sparklers")
  if (token.length >= 4 && word.length >= 4) {
    const prefixLen = Math.min(token.length, word.length, 5)
    if (levenshtein(token.slice(0, prefixLen), word.slice(0, prefixLen)) <= 1) return true
  }

  return false
}

function tokenMatches(token: string, words: string[], haystack: string): boolean {
  if (haystack.includes(token)) return true
  return words.some((word) => fuzzyWordMatch(token, word))
}

export function buildProductSearchWords(product: Product): string[] {
  const raw = [
    product.name,
    product.description,
    product.brand,
    product.tag,
    product.slug?.replace(/-/g, ' '),
    product.category?.name,
  ]
    .filter(Boolean)
    .join(' ')

  return normalize(raw).split(' ').filter(Boolean)
}

export function productSearchScore(product: Product, query: string): number {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return 0

  const tokens = normalizedQuery.split(' ').filter(Boolean)
  const words = buildProductSearchWords(product)
  const haystack = words.join(' ')
  const name = normalize(product.name)
  const nameWords = name.split(' ').filter(Boolean)

  let score = 0

  for (const token of tokens) {
    if (!tokenMatches(token, words, haystack)) return -1

    if (name === normalizedQuery) score += 200
    else if (name.includes(normalizedQuery)) score += 150
    else if (nameWords.some((word) => fuzzyWordMatch(token, word))) score += 100
    else if (haystack.includes(token)) score += 60
    else score += 30
  }

  return score
}

/** Fuzzy product search — tolerates typos and partial words. Results are relevance-ranked. */
export function filterProductsByQuery(products: Product[], query: string): Product[] {
  const trimmed = query.trim()
  if (!trimmed) return products

  return products
    .map((product) => ({ product, score: productSearchScore(product, trimmed) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product)
}
