import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { HomeNewsletterCard } from '@/components/prime/HomeNewsletter'
import { useGooglePlaceReviews } from '@/hooks/useGooglePlaceReviews'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'
import type { GooglePlaceReview } from '@/types/googleReviews'
import { cn } from '@/lib/utils'

const REVIEW_ROTATE_MS = 7000

function StarRating({ rating }: { rating: number }) {
  const full = Math.min(5, Math.max(0, Math.round(rating)))
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem] ${
            index < full ? 'fill-[#C9A24A] text-[#C9A24A]' : 'fill-transparent text-[#C9A24A]/35'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function GoogleReviewSlide({ review }: { review: GooglePlaceReview }) {
  return (
    <figure className="mx-auto flex max-w-2xl flex-col border-l-2 border-[#C9A24A]/75 bg-white/60 px-4 py-4 backdrop-blur-[2px] sm:px-8 sm:py-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <StarRating rating={review.rating} />
        {review.relativeTime ? (
          <span className="text-[10px] text-[#8B7355]/85 sm:text-xs">{review.relativeTime}</span>
        ) : null}
      </div>
      <blockquote>
        <p className="text-sm leading-relaxed text-[#062B63]/88 whitespace-pre-wrap sm:text-base sm:leading-relaxed">
          “{review.text}”
        </p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 text-sm font-medium text-[#8B7355]">
        {review.profilePhotoUrl ? (
          <img
            src={review.profilePhotoUrl}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C9A24A]/35"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : null}
        <span>{review.authorName}</span>
        <span className="text-[10px] font-normal uppercase tracking-wider text-[#8B7355]/70">
          Google review
        </span>
      </figcaption>
    </figure>
  )
}

function GoogleReviewsCarousel({ reviews }: { reviews: GooglePlaceReview[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = reviews.length

  const go = useCallback(
    (next: number) => {
      if (count === 0) return
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (count < 2 || paused) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, REVIEW_ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [count, paused])

  const review = reviews[index]
  if (!review) return null

  return (
    <div
      className="mx-auto mt-6 max-w-3xl sm:mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative min-h-[12rem] sm:min-h-[14rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        <GoogleReviewSlide key={`${review.authorName}-${index}`} review={review} />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
        <button
          type="button"
          onClick={() => go(index - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DFD0] bg-white/80 text-[#062B63] shadow-sm transition hover:border-[#0077B6]/40 hover:text-[#0077B6]"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Review slides">
          {reviews.map((item, dotIndex) => (
            <button
              key={`${item.authorName}-dot-${dotIndex}`}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Review ${dotIndex + 1} of ${count}`}
              onClick={() => go(dotIndex)}
              className={cn(
                'h-2 rounded-full transition-all',
                dotIndex === index ? 'w-6 bg-[#0077B6]' : 'w-2 bg-[#C9A24A]/45 hover:bg-[#C9A24A]/70',
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DFD0] bg-white/80 text-[#062B63] shadow-sm transition hover:border-[#0077B6]/40 hover:text-[#0077B6]"
          aria-label="Next review"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-[#8B7355]/80 sm:text-xs">
        Review {index + 1} of {count} · changes every few seconds
      </p>
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

        {reviews.length > 0 ? <GoogleReviewsCarousel reviews={reviews} /> : null}

        {reviewsState.status === 'error' || (reviewsState.status === 'ready' && reviews.length === 0) ? (
          <div className="mx-auto mt-6 max-w-lg text-center text-sm text-[#062B63]/75">
            <p>We couldn&apos;t load Google reviews right now.</p>
            {reviewsState.status === 'error' && reviewsState.message ? (
              <p className="mt-2 text-xs text-[#8B7355] break-words">{reviewsState.message}</p>
            ) : null}
            {reviewsState.status === 'error' ? (
              <p className="mt-2 text-xs font-semibold text-[#062B63]/80">
                Console shows <code className="text-[10px]">RefererNotAllowedMapError</code>? Add{' '}
                <code className="text-[10px]">http://localhost:5173/*</code> under API key → HTTP
                referrers, save, wait 1–2 min, restart dev.
              </p>
            ) : null}
            <ul className="mt-3 space-y-1 text-left text-xs text-[#8B7355] sm:mx-auto sm:max-w-md">
              <li>1. Link a <strong>billing account</strong> on the Google Cloud project.</li>
              <li>
                2. Enable <strong>Maps JavaScript API</strong>, <strong>Places API (New)</strong>, and{' '}
                <strong>Places API</strong> (legacy).
              </li>
              <li>
                3. API key → HTTP referrers: <code className="text-[10px]">http://localhost:5173/*</code>{' '}
                and your live domain.
              </li>
              <li>
                4. <code className="text-[10px]">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="text-[10px]">.env</code>{' '}
                — restart <code className="text-[10px]">npm run dev</code>.
              </li>
            </ul>
            <a
              href={STORE_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-semibold text-[#0077B6] underline-offset-2 hover:underline"
            >
              Open reviews on Google Maps
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}

        {summary && reviews.length > 0 ? (
          <p className="mx-auto mt-5 text-center sm:mt-6">
            <a
              href={summary.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0077B6]/90 underline-offset-2 hover:text-[#0077B6] hover:underline sm:text-sm"
            >
              More on Google Maps
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </a>
          </p>
        ) : null}

        <HomeNewsletterCard />
      </div>
    </section>
  )
}
