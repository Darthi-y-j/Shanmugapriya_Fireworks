import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types/database'
import { getProductImageUrls } from '@/lib/productImages'
import { getYouTubeEmbedUrl } from '@/lib/youtube'
import { cn } from '@/lib/utils'
import { ProductImage } from './ProductImage'

type MediaSlideType = 'image' | 'upload' | 'youtube'

interface MediaSlide {
  type: MediaSlideType
  label: string
  imageUrl?: string
  key: string
}

function buildMediaSlides(product: Product): MediaSlide[] {
  const slides: MediaSlide[] = getProductImageUrls(product).map((imageUrl, index) => ({
    type: 'image',
    label: index === 0 ? 'Product image' : `Product image ${index + 1}`,
    imageUrl,
    key: `image-${index}`,
  }))

  if (product.video_url?.trim()) {
    slides.push({ type: 'upload', label: 'Product video', key: 'upload' })
  }
  if (product.youtube_url?.trim() && getYouTubeEmbedUrl(product.youtube_url)) {
    slides.push({ type: 'youtube', label: 'YouTube video', key: 'youtube' })
  }

  return slides
}

interface ProductMediaCarouselProps {
  product: Product
  priority?: boolean
  className?: string
  perforationDotClass?: string
  perforationLineClass?: string
  children?: ReactNode
}

const SWIPE_THRESHOLD_PX = 48

export function ProductMediaCarousel({
  product,
  priority = false,
  className,
  perforationDotClass,
  perforationLineClass,
  children,
}: ProductMediaCarouselProps) {
  const slides = useMemo(() => buildMediaSlides(product), [product])
  const youtubeEmbed = product.youtube_url?.trim()
    ? getYouTubeEmbedUrl(product.youtube_url)
    : null

  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasMultiple = slides.length > 1

  useEffect(() => {
    setActiveIndex(0)
  }, [product.id])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const current = slides[activeIndex]
    if (current?.type !== 'upload') {
      video.pause()
    }
  }, [activeIndex, slides])

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return
      const wrapped = (index + slides.length) % slides.length
      setActiveIndex(wrapped)
    },
    [hasMultiple, slides.length],
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX == null || !hasMultiple) return
    const endX = event.changedTouches[0]?.clientX
    if (endX == null) return
    const delta = touchStartX - endX
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      if (delta > 0) goNext()
      else goPrev()
    }
    setTouchStartX(null)
  }

  return (
    <>
      <div
        className={cn(
          'relative h-[min(56vw,260px)] w-full overflow-hidden bg-[#1a120e] sm:h-[min(50vw,300px)] lg:h-[min(36vh,300px)]',
          className,
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.key}
              className="relative h-full min-w-full shrink-0"
              aria-hidden={slides[activeIndex]?.key !== slide.key}
            >
              {slide.type === 'image' && slide.imageUrl && (
                <>
                  <ProductImage
                    src={slide.imageUrl}
                    alt={product.name}
                    priority={priority && slide.key === 'image-0'}
                    className="absolute inset-0 h-full w-full object-contain object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </>
              )}

              {slide.type === 'upload' && product.video_url && (
                <video
                  ref={videoRef}
                  src={product.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                />
              )}

              {slide.type === 'youtube' && youtubeEmbed && (
                <div className="absolute inset-0 bg-black">
                  {slides[activeIndex]?.type === 'youtube' ? (
                    <iframe
                      src={youtubeEmbed}
                      title={`${product.name} video`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>

        {children}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-cream-50 shadow-lg backdrop-blur-sm transition hover:border-gold-400/45 hover:bg-black/75 sm:left-3 sm:h-10 sm:w-10"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-cream-50 shadow-lg backdrop-blur-sm transition hover:border-gold-400/45 hover:bg-black/75 sm:right-3 sm:h-10 sm:w-10"
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div
        className="relative flex items-center bg-navy-950/60 px-3 py-1 backdrop-blur-sm"
        aria-label={hasMultiple ? `Media ${activeIndex + 1} of ${slides.length}` : undefined}
      >
        <div className={cn('h-2.5 w-2.5 -translate-x-1/2 rounded-full', perforationDotClass)} aria-hidden="true" />

        {hasMultiple ? (
          <div className="mx-2 flex flex-1 items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  index === activeIndex ? 'h-2 w-2 bg-gold-400 ring-2 ring-gold-400/30' : 'h-1.5 w-1.5 bg-white/25 hover:bg-white/45',
                )}
                aria-label={`Show ${slide.label}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        ) : (
          <div className={cn('mx-2 flex-1 border-t border-dashed', perforationLineClass)} aria-hidden="true" />
        )}

        <div className={cn('h-2.5 w-2.5 translate-x-1/2 rounded-full', perforationDotClass)} aria-hidden="true" />
      </div>
    </>
  )
}
