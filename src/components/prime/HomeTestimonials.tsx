import { ExternalLink, Star } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { HomeNewsletterCard } from '@/components/prime/HomeNewsletter'
import { useGooglePlaceReviews } from '@/hooks/useGooglePlaceReviews'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'
import type { GooglePlaceReview } from '@/types/googleReviews'

function StarRating({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)))
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
            index < full ? 'fill-[#C9A24A] text-[#C9A24A]' : 'fill-transparent text-[#C9A24A]/35'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function GoogleReviewCard({ review, index }: { review: GooglePlaceReview; index: number }) {
  return (
    <AnimateIn animation="fade-up" delay={60 + index * 50} duration={650}>
      <figure className="flex h-full flex-col border-l-2 border-[#C9A24A]/75 bg-white/55 px-3 py-2.5 backdrop-blur-[2px] sm:px-5 sm:py-5">
        <div className="mb-1.5 flex items-center justify-between gap-2 sm:mb-2">
          <StarRating rating={review.rating} />
          {review.relativeTime ? (
            <span className="shrink-0 text-[9px] text-[#8B7355]/80 sm:text-[10px]">{review.relativeTime}</span>
          ) : null}
        </div>
        <blockquote className="min-h-0 flex-1">
          <p className="text-[11px] leading-snug text-[#062B63]/82 whitespace-pre-wrap sm:text-sm sm:leading-relaxed">
            {review.text}
          </p>
        </blockquote>
        <figcaption className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-[#8B7355] sm:mt-3 sm:text-xs">
          {review.profilePhotoUrl ? (
            <img
              src={review.profilePhotoUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover ring-1 ring-[#C9A24A]/30"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <span>— {review.authorName}</span>
        </figcaption>
      </figure>
    </AnimateIn>
  )
}

function GoogleReviewsFallback() {
  return (
    <div className="mx-auto mt-5 max-w-lg text-center sm:mt-8">
      <p className="text-sm text-[#062B63]/75">
        Read what customers say on Google Maps.
      </p>
      <a
        href={STORE_GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0077B6] underline-offset-2 hover:underline"
      >
        View Google reviews
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}

export function HomeTestimonials() {
  const reviewsState = useGooglePlaceReviews()

  const reviews =
    reviewsState.status === 'ready'
      ? reviewsState.data.reviews.filter((item) => item.text.trim().length > 0)
      : []

  const summary =
    reviewsState.status === 'ready' && reviewsState.data.rating != null
      ? {
          rating: reviewsState.data.rating,
          total: reviewsState.data.userRatingsTotal,
          mapsUrl: reviewsState.data.mapsUrl ?? STORE_GOOGLE_MAPS_URL,
        }
      : null

  return (
    <section className="relative overflow-hidden py-8 sm:py-16 lg:py-20" aria-labelledby="home-testimonials-heading">
      <OptimizedBackground src={ABOUT_IMAGES.rangoliBg} priority={false} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8B7355] sm:text-[10px] sm:tracking-[0.34em]">
              Google Reviews
            </p>
            <h2
              id="home-testimonials-heading"
              className="mt-2 font-display text-xl font-bold leading-tight text-[#062B63] sm:mt-3 sm:text-[2.15rem] lg:text-[2.35rem]"
            >
              Spreading <span className="text-[#C9A24A]">Happiness</span> Everywhere
            </h2>
            {summary ? (
              <p className="mt-2 text-xs text-[#062B63]/70 sm:text-sm">
                <span className="font-semibold text-[#062B63]">{summary.rating.toFixed(1)}</span>
                {' '}
                on Google
                {summary.total > 0 ? (
                  <>
                    {' '}
                    · {summary.total.toLocaleString('en-IN')} review{summary.total === 1 ? '' : 's'}
                  </>
                ) : null}
              </p>
            ) : null}
          </div>
        </AnimateIn>

        {reviewsState.status === 'loading' ? (
          <p className="mx-auto mt-6 text-center text-sm text-[#8B7355]">Loading Google reviews…</p>
        ) : null}

        {reviews.length > 0 ? (
          <div
            className={`mx-auto mt-5 grid max-w-5xl gap-2.5 sm:mt-8 sm:gap-5 ${
              reviews.length >= 3 ? 'sm:grid-cols-3' : reviews.length === 2 ? 'sm:grid-cols-2' : ''
            }`}
          >
            {reviews.map((item, index) => (
              <GoogleReviewCard key={`${item.authorName}-${index}`} review={item} index={index} />
            ))}
          </div>
        ) : null}

        {reviewsState.status === 'error' || (reviewsState.status === 'ready' && reviews.length === 0) ? (
          <GoogleReviewsFallback />
        ) : null}

        {summary ? (
          <p className="mx-auto mt-5 max-w-5xl text-center sm:mt-6">
            <a
              href={summary.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B6] underline-offset-2 hover:underline sm:text-sm"
            >
              See all reviews on Google Maps
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </a>
          </p>
        ) : null}

        <HomeNewsletterCard />
      </div>
    </section>
  )
}
