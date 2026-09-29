import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { STORE_GOOGLE_MAPS_URL, STORE_GOOGLE_PLACE_ID } from '@/lib/maps'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

let loaderConfigured = false

const LOAD_TIMEOUT_MS = 20_000

const KEY_SETUP_HINT =
  'Google Cloud → Credentials → open the SAME key as VITE_GOOGLE_MAPS_API_KEY → ' +
  '(1) Application restrictions: None OR add http://localhost:5173/* ' +
  '(2) API restrictions: Don’t restrict key OR allow Maps JavaScript API + Places API (New). ' +
  'ApiTargetBlockedMapError means the key is missing Maps JavaScript API in API restrictions.'

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(
        () => reject(new Error(`${label} timed out. ${KEY_SETUP_HINT}`)),
        LOAD_TIMEOUT_MS,
      )
    }),
  ])
}

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!apiKey?.trim()) {
    throw new Error(
      'Missing VITE_GOOGLE_MAPS_API_KEY in .env — restart npm run dev after adding it.',
    )
  }
  return apiKey.trim()
}

function normalizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  if (/ApiTargetBlockedMapError/i.test(message) || /api target blocked/i.test(message)) {
    return `ApiTargetBlockedMapError: your API key’s API restrictions block Maps/Places. ${KEY_SETUP_HINT}`
  }
  if (/RefererNotAllowedMapError/i.test(message) || /referer/i.test(message)) {
    return `RefererNotAllowedMapError: add http://localhost:5173/* under HTTP referrers for this key.`
  }
  if (/PERMISSION_DENIED/i.test(message) && /review/i.test(message)) {
    return `Google blocked the reviews field (PERMISSION_DENIED). Fix API restrictions first; if it persists, review text may require a higher Places billing tier. ${KEY_SETUP_HINT}`
  }
  return message
}

async function ensureMapsLoader(): Promise<void> {
  if (loaderConfigured) return
  setOptions({ key: getApiKey(), v: 'weekly', language: 'en' })
  loaderConfigured = true
  await importLibrary('places')
}

function reviewText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'text' in value) {
    const text = (value as { text?: string }).text
    return text ?? ''
  }
  return ''
}

function mapPlaceToPayload(place: google.maps.places.Place): GooglePlaceReviewsPayload {
  const rawReviews: google.maps.places.Review[] = place.reviews ?? []
  const reviews = rawReviews
    .map((review: google.maps.places.Review) => ({
      authorName: review.authorAttribution?.displayName ?? 'Google user',
      rating: review.rating ?? 0,
      text: reviewText(review.text),
      relativeTime: review.relativePublishTimeDescription ?? '',
      profilePhotoUrl: review.authorAttribution?.photoURI ?? null,
    }))
    .filter((item: { text: string }) => item.text.trim().length > 0)

  return {
    placeName: place.displayName ?? '',
    rating: place.rating ?? null,
    userRatingsTotal: place.userRatingCount ?? 0,
    mapsUrl: place.googleMapsURI ?? STORE_GOOGLE_MAPS_URL,
    reviews,
  }
}

/** Place class (recommended). PlacesService is not available to new Google Cloud customers. */
async function loadViaPlaceClass(placeId: string): Promise<GooglePlaceReviewsPayload> {
  const places = await importLibrary('places')
  const place = new places.Place({ id: placeId })

  try {
    await place.fetchFields({
      fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'],
    })
    return mapPlaceToPayload(place)
  } catch (error) {
    const normalized = normalizeError(error)
    try {
      await place.fetchFields({
        fields: ['displayName', 'rating', 'userRatingCount', 'googleMapsURI'],
      })
      const partial = mapPlaceToPayload(place)
      if (partial.rating != null) {
        throw new Error(
          `${normalized} Place rating loaded (${partial.rating}★) but review text did not.`,
        )
      }
    } catch (inner) {
      throw new Error(normalizeError(inner))
    }
    throw new Error(normalized)
  }
}

export async function loadGooglePlaceReviewsClient(
  placeId = STORE_GOOGLE_PLACE_ID,
): Promise<GooglePlaceReviewsPayload> {
  return withTimeout(loadGooglePlaceReviewsClientInner(placeId), 'Google reviews')
}

async function loadGooglePlaceReviewsClientInner(
  placeId: string,
): Promise<GooglePlaceReviewsPayload> {
  await ensureMapsLoader()

  try {
    const result = await loadViaPlaceClass(placeId)
    if (result.reviews.length === 0 && (result.userRatingsTotal ?? 0) > 0) {
      throw new Error(
        `Google lists ${result.userRatingsTotal} reviews but did not return review text. ${KEY_SETUP_HINT}`,
      )
    }
    return result
  } catch (error) {
    throw new Error(normalizeError(error))
  }
}
