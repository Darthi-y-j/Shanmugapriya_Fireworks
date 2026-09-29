/** CID from https://maps.app.goo.gl/qXnU2NoDvUKoYvXT7 (feature id …:0x68f27e70b2eb5d54). */
const DEFAULT_PLACE_CID = '7562245746811690324'

export async function fetchPlaceReviews(apiKey, cid = DEFAULT_PLACE_CID) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('cid', String(cid))
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews,url')
  url.searchParams.set('key', apiKey)

  const response = await fetch(url)
  const json = await response.json()

  if (json.status !== 'OK' || !json.result) {
    const message = json.error_message || json.status || 'Place details request failed'
    throw new Error(message)
  }

  return json.result
}

function mapReviews(result) {
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

  const cid = process.env.GOOGLE_PLACE_CID || DEFAULT_PLACE_CID

  try {
    const result = await fetchPlaceReviews(apiKey, cid)
    const body = mapReviews(result)

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'fetch_failed'
    res.status(502).json({ error: 'fetch_failed', message })
  }
}
