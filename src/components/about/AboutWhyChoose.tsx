import { Diamond, Heart, Leaf, Shield } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'
import { HOME_IMAGES } from '@/lib/homeImages'

const REASONS = [
  {
    icon: Shield,
    title: 'Safety First',
    description: 'Licensed products with tamper-proof packaging and strict quality checks.',
  },
  {
    icon: Diamond,
    title: 'Premium Quality',
    description: 'Crafted in Sivakasi with generations of expertise and attention to detail.',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    description: 'Responsible manufacturing with greener formulations where possible.',
  },
  {
    icon: Heart,
    title: 'Customer Care',
    description: 'Dedicated support for families, retailers and wholesalers across India.',
  },
] as const

export function AboutWhyChoose() {
  return (
    <section
      className="relative z-10 overflow-hidden px-4 py-10 sm:px-6 sm:py-20 lg:py-24"
      aria-labelledby="why-choose-heading"
    >
      <OptimizedBackground
        src={HOME_IMAGES.whyChooseMobileBg}
        fit="fill"
        priority={false}
        className="md:hidden"
      />
      <OptimizedBackground
        src={ABOUT_IMAGES.rangoliBg}
        priority={false}
        className="hidden md:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8B7355]">
              Why Choose Us
            </p>
            <h2
              id="why-choose-heading"
              className="mt-3 font-display text-[1.65rem] font-bold leading-tight text-[#062B63] sm:mt-4 sm:text-[2.5rem] lg:text-[2.85rem]"
            >
              Celebrations You Can{' '}
              <span style={{ color: ABOUT_COLORS.gold }}>Trust</span>
            </h2>
          </div>
        </AnimateIn>

        <div className="mt-6 grid gap-2.5 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {REASONS.map((item, index) => (
            <AnimateIn key={item.title} animation="fade-up" delay={60 + index * 60} duration={650}>
              <article
                className="about-why-card relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-[#062B63]/8 text-center shadow-[0_4px_18px_rgba(6,43,99,0.06)] transition duration-300 sm:rounded-2xl sm:shadow-[0_6px_28px_rgba(6,43,99,0.06)] sm:hover:-translate-y-1 sm:hover:shadow-[0_14px_40px_rgba(6,43,99,0.1)]"
              >
                <OptimizedBackground src={ABOUT_IMAGES.whyChooseCardBg} priority={false} />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-white/94 via-white/88 to-white/92"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex h-full flex-col items-center px-4 py-5 sm:px-6 sm:py-10">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#062B63]/12 bg-white/90 shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]"
                    aria-hidden="true"
                  >
                    <item.icon className="h-5 w-5 text-[#062B63] sm:h-6 sm:w-6" strokeWidth={1.25} />
                  </div>
                  <h3 className="mt-3 font-display text-base font-bold text-[#062B63] sm:mt-5 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-xs leading-snug text-[#062B63]/80 sm:mt-3 sm:text-sm sm:leading-relaxed">{item.description}</p>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
