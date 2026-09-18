import { useRef } from 'react'
import { StaticPicture } from '@/components/shared/StaticPicture'
import { useSkewedParallax } from '@/hooks/useSkewedParallax'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'

type SkewedParallaxBandProps = {
  title: string
  subtitle: string
}

/** Parallelogram skew — top & bottom slant in the same direction (matches demo skewY) */
const SKEWED_CLIP =
  'polygon(0 7%, 100% 0%, 100% 93%, 0 100%)' as const

export function SkewedParallaxBand({ title, subtitle }: SkewedParallaxBandProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  useSkewedParallax({ wrapperRef, bgRef })

  return (
    <div className="relative z-20 -mt-28 -mb-14 w-full sm:-mt-36 sm:-mb-16 md:-mt-44 md:-mb-20">
      <div
        ref={wrapperRef}
        className="skewed-parallax-container relative h-[400px] w-full overflow-hidden shadow-2xl sm:h-[460px] md:h-[520px]"
        style={{ clipPath: SKEWED_CLIP }}
      >
        <div ref={bgRef} className="skewed-parallax-bg" aria-hidden="true">
          <StaticPicture
            src={ABOUT_IMAGES.heritageTempleParallax}
            priority
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover object-center"
          />
        </div>

        <div className="skewed-parallax-overlay absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="skewed-parallax-badge mb-6 bg-white px-10 py-5 sm:mb-8 sm:px-14 sm:py-6">
            <h3 className="font-display text-3xl font-bold tracking-tight text-[#062B63] sm:text-4xl md:text-5xl">
              {title}
            </h3>
          </div>

          <p className="max-w-2xl text-base font-medium leading-relaxed text-white drop-shadow-md sm:text-lg md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
