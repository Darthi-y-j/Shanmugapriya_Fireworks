export type GooglePlaceDetailsReview = {
  author_name: string
  rating: number
  text?: string
  relative_time_description?: string
  profile_photo_url?: string
}

export type GooglePlaceDetailsResult = {
  name: string
  rating?: number
  user_ratings_total?: number
  url?: string
  reviews?: GooglePlaceDetailsReview[]
}

export function fetchPlaceReviewsNew(
  apiKey: string,
  placeId?: string,
): Promise<GooglePlaceDetailsResult>

export function fetchPlaceReviewsLegacy(
  apiKey: string,
  cid?: string,
): Promise<GooglePlaceDetailsResult>

export function fetchPlaceReviews(
  apiKey: string,
  options?: { placeId?: string; cid?: string },
): Promise<GooglePlaceDetailsResult>

export default function handler(
  req: { method?: string },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: (body?: string) => void }
    setHeader: (name: string, value: string) => void
    statusCode: number
    end: (body?: string) => void
  },
): Promise<void>
