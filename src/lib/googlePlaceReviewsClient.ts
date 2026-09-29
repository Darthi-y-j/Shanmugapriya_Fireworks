import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { STORE_GOOGLE_MAPS_URL, STORE_GOOGLE_PLACE_ID } from '@/lib/maps'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

let loaderConfigured = false

const LOAD_TIMEOUT_MS = 20_000

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(
        () => reject(new Error(`${label} timed out — check API key referrers include http://localhost:5173/*`)),
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

async function ensureMapsLoader(): Promise<void> {
  if (loaderConfigured) return
  setOptions({ key: getApiKey(), v: 'weekly', language: 'en' })
  loaderConfigured = true
  await importLibrary('places')
}

function mapLegacyPlaceResult(place: google.maps.places.PlaceResult): GooglePlaceReviewsPayload {
  const reviews = (place.reviews ?? [])
    .map((review) => ({
      authorName: review.author_name ?? 'Google user',
      rating: review.rating ?? 0,
      text: review.text ?? '',
      relativeTime: review.relative_time_description ?? '',
      profilePhotoUrl: review.profile_photo_url ?? null,
    }))
    .filter((item) => item.text.trim().length > 0)

  return {
    placeName: place.name ?? '',
    rating: place.rating ?? null,
    userRatingsTotal: place.user_ratings_total ?? 0,
    mapsUrl: place.url ?? STORE_GOOGLE_MAPS_URL,
    reviews,
  }
}

/** Legacy PlacesService — returns review text when "Places API" (legacy) is enabled. */
function loadViaPlacesService(placeId: string): Promise<GooglePlaceReviewsPayload> {
  const host = document.createElement('div')
  const service = new google.maps.places.PlacesService(host)

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url'],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
          reject(new Error(`PlacesService getDetails: ${status}`))
          return
        }
        resolve(mapLegacyPlaceResult(place))
      },
    )
  })
}

function reviewText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'text' in value) {
    const text = (value as { text?: string }).text
    return text ?? ''
  }
  return ''
}

/** New Place class — rating works; `reviews` often needs Enterprise (PERMISSION_DENIED). */
async function loadViaPlaceClass(placeId: string): Promise<GooglePlaceReviewsPayload> {
  const places = await importLibrary('places')
  const place = new places.Place({ id: placeId })

  await place.fetchFields({
    fields: ['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'],
  })

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
    const legacy = await loadViaPlacesService(placeId)
    if (legacy.reviews.length > 0) return legacy
  } catch {
    /* try new Place class next */
  }

  try {
    const modern = await loadViaPlaceClass(placeId)
    if (modern.reviews.length > 0) return modern
    throw new Error('No review text returned from Google for this place.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Place.fetchFields failed'
    throw new Error(
      `${message} Fix RefererNotAllowedMapError: Google Cloud → Credentials → your key → HTTP referrers → add http://localhost:5173/* and your live site. Enable Maps JavaScript API, Places API (New), and Places API (legacy).`,
    )
  }
}
