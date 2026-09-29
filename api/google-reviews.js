/** Place ID from https://maps.app.goo.gl/qXnU2NoDvUKoYvXT7 (feature id 0x3b01335b87340aa3:0x68f27e70b2eb5d54). */
const DEFAULT_PLACE_ID = 'ChIJowo0h1szATsRVF3rsnB-8mg'

/** @deprecated Legacy CID fallback */
const DEFAULT_PLACE_CID = '7562245746811690324'

function mapLegacyResult(result) {
  return {
    name: result.name,
    rating: result.rating,
    user_ratings_total: result.user_ratings_total,
    url: result.url,
    reviews: result.reviews ?? [],
  }
}

function mapNewPlace(place) {
  return {
    name: place.displayName?.text ?? '',
    rating: place.rating,
    user_ratings_total: place.userRatingCount,
    url: place.googleMapsUri,
    reviews: (place.reviews ?? []).map((review) => ({
      author_name: review.authorAttribution?.displayName ?? 'Google user',
      rating: review.rating ?? 0,
      text: review.text?.text ?? '',
      relative_time_description: review.relativePublishTimeDescription ?? '',
      profile_photo_url: review.authorAttribution?.photoUri ?? null,
    })),
  }
}

export async function fetchPlaceReviewsNew(apiKey, placeId = DEFAULT_PLACE_ID) {
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,googleMapsUri',
    },
  })
  const json = await response.json()
  if (json.error) {
    throw new Error(json.error.message || 'Places API (New) request failed')
  }
  return mapNewPlace(json)
}

export async function fetchPlaceReviewsLegacy(apiKey, cid = DEFAULT_PLACE_CID) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('cid', String(cid))
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url')
  url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  const json = await response.json()

  if (json.status !== 'OK' || !json.result) {
    const message = json.error_message || json.status || 'Legacy Place Details request failed'
    throw new Error(message)
  }

  return mapLegacyResult(json.result)
}

/** Prefer Places API (New); fall back to legacy Place Details if enabled. */
export async function fetchPlaceReviews(apiKey, options = {}) {
  const placeId = options.placeId || process.env.GOOGLE_PLACE_ID || DEFAULT_PLACE_ID
  const cid = options.cid || process.env.GOOGLE_PLACE_CID || DEFAULT_PLACE_CID

  try {
    return await fetchPlaceReviewsNew(apiKey, placeId)
  } catch (newError) {
    try {
      return await fetchPlaceReviewsLegacy(apiKey, cid)
    } catch {
      throw newError
    }
  }
}

function mapReviewsResponse(result) {
  return {
    placeName: result.name,
    rating: result.rating ?? null,
    userRatingsTotal: result.user_ratings_total ?? 0,
    mapsUrl: result.url ?? null,
    reviews: (result.reviews ?? []).map((review) => ({
      authorName: review.author_name,
      rating: review.rating,
      text: review.text ?? '',
      relativeTime: review.relative_time_description ?? '',
      profilePhotoUrl: review.profile_photo_url ?? null,
    })),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'missing_api_key' })
    return
  }

  try {
    const result = await fetchPlaceReviews(apiKey)
    const body = mapReviewsResponse(result)

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'fetch_failed'
    res.status(502).json({ error: 'fetch_failed', message })
  }
}
