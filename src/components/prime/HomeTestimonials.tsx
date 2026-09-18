import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { HomeNewsletterCard } from '@/components/prime/HomeNewsletter'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'

const TESTIMONIALS = [
  {
    quote: 'Good quality and safe packaging — our Diwali felt brighter this year.',
    name: 'Priya R.',
    location: 'Chennai',
  },
  {
    quote: 'Reliable for our shop. Sparklers and flower pots sell well every season.',
    name: 'Karthik M.',
    location: 'Coimbatore',
  },
  {
    quote: 'A brand our family has ordered from for many festivals. Consistent service.',
    name: 'Anitha S.',
    location: 'Madurai',
  },
] as const

export function HomeTestimonials() {
  return (
    <section className="relative overflow-hidden py-8 sm:py-16 lg:py-20" aria-labelledby="home-testimonials-heading">
      <OptimizedImage
        src={`${ABOUT_IMAGES.rangoliBg}?v=2`}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8B7355] sm:text-[10px] sm:tracking-[0.34em]">
              From Our Community
            </p>
            <h2
              id="home-testimonials-heading"
              className="mt-2 font-display text-xl font-bold leading-tight text-[#062B63] sm:mt-3 sm:text-[2.15rem] lg:text-[2.35rem]"
            >
              Spreading <span className="text-[#C9A24A]">Happiness</span> Everywhere
            </h2>
          </div>
        </AnimateIn>

        <div className="mx-auto mt-5 grid max-w-5xl gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-5">
          {TESTIMONIALS.map((item, index) => (
            <AnimateIn key={item.name} animation="fade-up" delay={60 + index * 50} duration={650}>
              <figure className="h-full border-l-2 border-[#C9A24A]/75 bg-white/55 px-3 py-2.5 backdrop-blur-[2px] sm:px-5 sm:py-5">
                <blockquote>
                  <p className="text-[11px] leading-snug text-[#062B63]/82 sm:text-sm sm:leading-relaxed">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-1.5 text-[10px] font-medium text-[#8B7355] sm:mt-3 sm:text-xs">
                  — {item.name}, {item.location}
                </figcaption>
              </figure>
            </AnimateIn>
          ))}
        </div>

        <HomeNewsletterCard />
      </div>
    </section>
  )
}
