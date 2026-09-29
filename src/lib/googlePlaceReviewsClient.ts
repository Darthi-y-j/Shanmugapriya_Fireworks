import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import { STORE_GOOGLE_MAPS_URL, STORE_GOOGLE_PLACE_ID } from '@/lib/maps'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

let loaderConfigured = false

function reviewText(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'text' in value) {
    const text = (value as { text?: string }).text
    return text ?? ''
  }
  return ''
}

export async function loadGooglePlaceReviewsClient(
  placeId = STORE_GOOGLE_PLACE_ID,
): Promise<GooglePlaceReviewsPayload> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
  if (!apiKey?.trim()) {
    throw new Error(
      'Missing VITE_GOOGLE_MAPS_API_KEY. Use a browser key (Maps JavaScript API + Places API New).',
    )
  }

  if (!loaderConfigured) {
    setOptions({ key: apiKey.trim(), v: 'weekly' })
    loaderConfigured = true
  }

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
