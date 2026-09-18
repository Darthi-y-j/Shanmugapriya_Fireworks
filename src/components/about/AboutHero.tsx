import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { AboutHeroBirds, AboutHeroHangDecor } from '@/components/about/AboutHeroDecor'
import { HeroCircleVisual } from '@/components/about/HeroCircleVisual'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'

const SIDE_WORDS = ['PEOPLE', 'TRADITION', 'CELEBRATION', 'PROGRESS'] as const

export function AboutHero() {
  return (
    <section className="about-hero relative min-h-0 overflow-hidden lg:min-h-[92vh]">
      <OptimizedBackground
        src={ABOUT_IMAGES.heroBg}
        priority
        imgClassName="object-[center_top]"
      />
      <AboutHeroHangDecor />
      <AboutHeroBirds />

      <aside
        className="pointer-events-none absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex xl:right-4"
        aria-hidden="true"
      >
        {SIDE_WORDS.map((word, index) => (
          <span key={word} className="flex flex-col items-center gap-3">
            {index === 3 && <span className="h-px w-7 bg-[#C9A24A]/75" />}
            <span
              className="text-[8px] font-semibold uppercase tracking-[0.4em] text-[#062B63]/50 [writing-mode:vertical-rl]"
            >
              {word}
            </span>
          </span>
        ))}
      </aside>

      <div
        className="relative z-10 mx-auto flex min-h-0 max-w-7xl items-start px-4 pb-8 pt-[7rem] sm:px-6 sm:pb-10 sm:pt-[7.5rem] lg:min-h-[92vh] lg:items-center lg:pb-14 lg:pt-[7.75rem]"
      >
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 xl:gap-10">
          <div className="max-w-[540px] pl-10 sm:pl-14 lg:pl-24 xl:pl-32">
            <AnimateIn animation="fade-up" duration={700}>
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8B7355]">
                <span className="h-px w-8 shrink-0 bg-[#C9A24A]" aria-hidden="true" />
                About Us
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={80} duration={750}>
              <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-[1.05] text-[#062B63] sm:text-[3.05rem] lg:text-[3.4rem] xl:text-[3.75rem]">
                A Brighter
                <br />
                <span style={{ color: ABOUT_COLORS.gold }}>Tomorrow</span>
                <br />
                Begins Here
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={160} duration={750}>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#062B63] sm:text-[11px]">
                Rooted in Tradition
                <span className="mx-2 text-[#C9A24A]">•</span>
                Driven by People
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={220} duration={750}>
              <p className="mt-6 max-w-md text-sm leading-[1.9] text-[#062B63]/72 sm:text-[15px]">
                At Shanmuga&apos;s, fireworks are more than products — they are emotions, traditions
                and cherished moments. For generations, we&apos;ve been part of India&apos;s celebrations,
                bringing light, colour and happiness to homes across the country.
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={300} duration={750}>
              <Link
                to="#our-story"
                className="about-hero-cta group mt-9 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:gap-3.5 hover:shadow-[0_12px_40px_rgba(6,43,99,0.35)]"
                style={{ backgroundColor: ABOUT_COLORS.navy }}
              >
                Our Story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </AnimateIn>
          </div>

          <AnimateIn
            animation="scale-in"
            delay={140}
            duration={900}
            className="flex justify-center lg:justify-end lg:pr-0 xl:pr-6"
          >
            <HeroCircleVisual />
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
