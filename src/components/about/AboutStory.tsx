import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { AboutMandala } from '@/components/about/AboutMandala'
import { StoryArchFrame } from '@/components/about/StoryArchFrame'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'

const SIDE_WORDS = ['Celebrating', 'Tradition', 'Inspiring', 'Generations'] as const

function StorySideLabels({ className = '', vertical = true }: { className?: string; vertical?: boolean }) {
  if (!vertical) {
    return (
      <aside className={className} aria-label="Brand pillars">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {SIDE_WORDS.map((word, index) => (
            <span key={word} className="flex items-center gap-3">
              <span
                className={`font-display text-sm font-semibold ${
                  index % 2 === 1 ? 'text-[#C9A24A]' : 'text-[#062B63]/75'
                }`}
              >
                {word}
              </span>
              {index < SIDE_WORDS.length - 1 && (
                <span className="text-[10px] text-[#C9A24A]/70" aria-hidden="true">✦</span>
              )}
            </span>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className={className} aria-label="Brand pillars">
      <div className="relative flex flex-col items-end gap-6 py-3 sm:gap-7">
        <span
          className="absolute right-full top-1 bottom-1 mr-4 w-px bg-gradient-to-b from-transparent via-[#C9A24A]/75 to-transparent"
          aria-hidden="true"
        />

        <span className="font-display text-sm text-[#C9A24A]/80" aria-hidden="true">✦</span>

        {SIDE_WORDS.map((word, index) => (
          <span key={word} className="group flex items-center gap-2.5 sm:gap-3">
            <span
              className="h-px w-5 bg-[#C9A24A]/45 transition-all duration-300 group-hover:w-7"
              aria-hidden="true"
            />
            <span
              className={`font-display text-sm font-semibold leading-tight sm:text-base xl:text-lg ${
                index % 2 === 1 ? 'text-[#C9A24A]' : 'text-[#062B63]/80'
              }`}
            >
              {word}
            </span>
          </span>
        ))}

        <span className="h-px w-8 bg-[#C9A24A]/60" aria-hidden="true" />
        <span className="font-display text-sm text-[#C9A24A]/80" aria-hidden="true">✦</span>
      </div>
    </aside>
  )
}

export function AboutStory() {
  return (
    <section
      id="our-story"
      className="about-story relative z-10 overflow-hidden py-10 sm:py-20 lg:py-24"
      aria-labelledby="our-story-heading"
    >
      <OptimizedBackground src={ABOUT_IMAGES.storyBg} priority={false} />
      <div className="pointer-events-none absolute inset-0 bg-white/90" aria-hidden="true" />

      <AboutMandala className="-left-8 top-8 h-32 w-32 opacity-[0.14] sm:h-56 sm:w-56 lg:left-4 lg:h-64 lg:w-64" />
      <AboutMandala
        flip
        className="-right-8 bottom-8 h-32 w-32 opacity-[0.14] sm:h-56 sm:w-56 lg:right-4 lg:h-64 lg:w-64"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <StorySideLabels
          className="pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:block xl:right-6"
        />

        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-10 xl:gap-14">
          <AnimateIn animation="slide-in-left" duration={800}>
            <div className="max-w-md lg:max-w-xl">
              <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8B7355] sm:gap-3 sm:text-[10px] sm:tracking-[0.34em]">
                <span className="h-px w-6 bg-[#C9A24A] sm:w-10" aria-hidden="true" />
                Our Story
              </p>
              <h2
                id="our-story-heading"
                className="mt-3 font-display text-[1.65rem] font-bold leading-[1.1] text-[#062B63] sm:mt-4 sm:text-[2.35rem] lg:text-[2.65rem]"
              >
                A Legacy of{' '}
                <span style={{ color: ABOUT_COLORS.gold }}>Light</span>
              </h2>
              <p className="mt-4 text-[13px] leading-[1.75] text-[#062B63]/85 sm:mt-6 sm:text-[15px] sm:leading-[1.9]">
                {SHANMUGA_BRAND.displayName} was born from a simple belief — that every celebration
                deserves the magic of light, colour and joy. What started as a small spark in Sivakasi
                has grown into a trusted name for families, retailers and wholesalers across India.
              </p>
              <p className="mt-3 text-[13px] leading-[1.75] text-[#062B63]/85 sm:mt-4 sm:text-[15px] sm:leading-[1.9]">
                We craft fireworks with care, passion and responsibility — so every festival feels
                brighter, every moment feels special, and every smile lasts a little longer.
              </p>
              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-[#C9A24A] px-5 py-2.5 text-xs font-semibold text-[#062B63] transition hover:bg-[#C9A24A]/10 sm:mt-8 sm:gap-2 sm:px-7 sm:py-3 sm:text-sm"
              >
                Our Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn
            animation="scale-in"
            delay={100}
            duration={850}
            className="flex justify-center lg:justify-end lg:pr-20 xl:pr-24"
          >
            <StoryArchFrame alt="Temple heritage at sunset — Shanmuga's Sivakasi roots" />
          </AnimateIn>
        </div>

        <StorySideLabels className="mt-6 lg:hidden" vertical={false} />
      </div>
    </section>
  )
}
