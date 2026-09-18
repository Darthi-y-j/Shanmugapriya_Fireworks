import { Link } from 'react-router-dom'
import { ArrowRight, Diamond, Shield, Star } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { HOME_IMAGES } from '@/lib/homeImages'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { warmupProductsPage } from '@/lib/prefetchProductsRoute'

const TRUST_ITEMS = [
  { icon: Diamond, label: 'Premium Quality' },
  { icon: Shield, label: 'Safe & Reliable' },
  { icon: Star, label: 'Celebrating Together' },
] as const

export function PrimeHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden sm:min-h-[94vh]">
      <OptimizedImage
        src={HOME_IMAGES.heroBg}
        alt=""
        priority
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <OptimizedImage
        src={HOME_IMAGES.topBanner}
        alt=""
        priority
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] block w-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#062B63]/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_85%_55%_at_50%_42%,rgba(255,255,255,0.88)_0%,rgba(255,248,238,0.55)_42%,rgba(255,255,255,0.12)_68%,transparent_82%)]"
        aria-hidden="true"
      />

      <div
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pb-14 pt-[7rem] text-center sm:min-h-[94vh] sm:px-8 sm:pb-16 sm:pt-[7.5rem] lg:pt-[7.75rem]"
      >
        <AnimateIn animation="fade-down" delay={60}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A6348] sm:text-sm">
            {SHANMUGA_BRAND.displayName}
          </p>
          <div className="mx-auto mt-2 h-px w-16 bg-[#A8862E]" aria-hidden="true" />
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={100}>
          <h1 className="mt-6 font-display text-[2.35rem] font-bold leading-[1.08] text-[#062B63] [text-shadow:0_1px_14px_rgba(255,255,255,0.65)] sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
            <span className="block">Brighter</span>
            <span className="mt-1 block text-[#8B6914]">Moments Happier</span>
            <span className="mt-1 block">Lives</span>
          </h1>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={160}>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#062B63]/80 sm:text-base">
            {SHANMUGA_BRAND.heroSubtext}
          </p>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={220}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/products"
              onClick={warmupProductsPage}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#062B63] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_32px_rgba(4,30,71,0.35)] transition hover:brightness-110"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#062B63]/70 bg-white/60 px-7 py-3.5 text-sm font-bold text-[#062B63] backdrop-blur-sm transition hover:bg-white/80"
            >
              Dealer Enquiry
            </Link>
          </div>
        </AnimateIn>

        <AnimateIn animation="fade-up" delay={280}>
          <ul
            className="mt-10 flex max-w-3xl flex-col gap-2 sm:flex-row sm:justify-center sm:gap-0 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-[#062B63]/15 sm:bg-white/55 sm:shadow-[0_12px_40px_rgba(6,43,99,0.12)] sm:backdrop-blur-md"
            aria-label="Why customers choose us"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className="group relative flex flex-1 items-center justify-center gap-3 rounded-xl border border-[#062B63]/10 bg-white/55 px-3.5 py-3 backdrop-blur-sm sm:flex-col sm:gap-2 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-4 sm:py-4"
              >
                {index > 0 && (
                  <span
                    className="pointer-events-none absolute bottom-3 left-0 top-3 hidden w-px bg-gradient-to-b from-transparent via-[#A8862E]/50 to-transparent sm:block"
                    aria-hidden="true"
                  />
                )}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#062B63]/90 shadow-[0_4px_14px_rgba(4,30,71,0.25)] sm:h-10 sm:w-10"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 text-[#C9A24A] sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                </div>
                <span className="text-[11px] font-bold leading-snug tracking-wide text-[#062B63] sm:text-center sm:text-[10px]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </AnimateIn>
      </div>

      <span className="sr-only">Celebrating with sparklers and fireworks from Sivakasi</span>
    </section>
  )
}
