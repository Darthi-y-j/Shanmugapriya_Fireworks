import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'
import { HOME_IMAGES } from '@/lib/homeImages'
import { optimizedBackgroundStyle } from '@/lib/optimizedAssets'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { SkewedParallaxBand } from '@/components/prime/SkewedParallaxBand'

const BLUE_DARK = SHANMUGA_BRAND.primary
const RANGOLI_BG = `${ABOUT_IMAGES.rangoliBg}?v=2`
const ABOUT_MOBILE_BG = HOME_IMAGES.aboutMobileBg

export function HomeAboutParallaxHero() {
  return (
    <section className="relative overflow-visible bg-transparent" aria-labelledby="home-about-parallax-heading">
      {/* Rangoli frame + copy — sits under slanted parallax overlap */}
      <div className="relative z-0 px-5 pb-28 pt-10 sm:px-6 sm:pb-40 sm:pt-10 lg:pb-44 lg:pt-12">
        <div
          className="pointer-events-none absolute inset-0 bg-white md:hidden"
          style={optimizedBackgroundStyle(ABOUT_MOBILE_BG, {
            size: '100% 100%',
            position: 'center',
          })}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={optimizedBackgroundStyle(RANGOLI_BG, {
            size: '100% 100%',
            position: 'center',
          })}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl px-2 text-center sm:px-0">
          <AnimateIn animation="fade-up" duration={700}>
            <div className="flex items-center justify-center gap-3">
              <span
                className="h-px w-8 shrink-0"
                style={{ backgroundColor: ABOUT_COLORS.gold }}
                aria-hidden="true"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#062B63]/70 md:text-slate-500">
                About Us
              </p>
              <span
                className="h-px w-8 shrink-0"
                style={{ backgroundColor: ABOUT_COLORS.gold }}
                aria-hidden="true"
              />
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={80} duration={750}>
            <h2
              id="home-about-parallax-heading"
              className="mt-5 font-display text-[2.15rem] font-bold leading-[1.08] text-[#062B63] sm:text-[3.2rem] lg:text-[3.5rem]"
            >
              A Brighter
              <br />
              <span className="text-[#A8862E] md:hidden">Tomorrow</span>
              <span className="about-hero-gradient-text hidden md:inline">Tomorrow</span>
              <br />
              Begins Here
            </h2>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={160} duration={750}>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#062B63] sm:text-[11px]">
              Rooted in Tradition
              <span className="mx-2 text-[#A8862E]">•</span>
              Driven by People
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={220} duration={750}>
            <p className="mx-auto mt-6 max-w-[18rem] text-sm leading-[1.85] text-[#062B63]/75 sm:max-w-2xl sm:text-base md:text-slate-600">
              At Shanmuga&apos;s, fireworks are more than products — they are emotions, traditions
              and cherished moments. For generations, we&apos;ve been part of India&apos;s celebrations,
              bringing light, colour and happiness to homes across the country.
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={300} duration={750}>
            <Link
              to="/about"
              className="about-hero-cta group relative z-30 mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:gap-3.5 hover:shadow-[0_12px_40px_rgba(9,105,213,0.35)]"
              style={{ backgroundColor: BLUE_DARK }}
            >
              Our Story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </AnimateIn>
        </div>
      </div>

      {/* Parallax overlaps upward onto rangoli background */}
      <SkewedParallaxBand
        title={SHANMUGA_BRAND.shortName}
        subtitle={`${SHANMUGA_BRAND.tagline} — proudly from Sivakasi, the heart of India's fireworks heritage. Trusted by families and dealers across the nation for premium, safe celebrations.`}
      />
    </section>
  )
}
