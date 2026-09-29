export type GooglePlaceReview = {
  authorName: string
  rating: number
  text: string
  relativeTime: string
  profilePhotoUrl: string | null
}

export type GooglePlaceReviewsPayload = {
  placeName: string
  rating: number | null
  userRatingsTotal: number
  mapsUrl: string | null
  reviews: GooglePlaceReview[]
}
