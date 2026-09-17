import { Flower2, Target, Users } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'

const CARDS: Array<{
  icon: typeof Flower2
  title: string
  body: string
  featured?: boolean
}> = [
  {
    icon: Flower2,
    title: 'Our Mission',
    body:
      'To bring joy, light and celebration into every home through safe, high-quality fireworks crafted with care and responsibility.',
  },
  {
    icon: Target,
    title: 'Our Vision',
    body:
      'To be India\'s most trusted fireworks brand — illuminating festivals, uniting families and inspiring generations with every spark.',
    featured: true,
  },
  {
    icon: Users,
    title: 'Our Values',
    body:
      'Quality craftsmanship, customer trust, safety-first manufacturing, and a deep respect for tradition guide everything we do.',
  },
]

export function AboutPurpose() {
  return (
    <section
      className="relative z-10 -mt-2 overflow-hidden bg-white px-4 pb-14 pt-6 sm:-mt-3 sm:px-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
      aria-labelledby="about-purpose-heading"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#8B7355]">
              Our Purpose
            </p>
            <h2
              id="about-purpose-heading"
              className="mt-4 font-display text-[2rem] font-bold leading-tight text-[#062B63] sm:text-[2.5rem] lg:text-[2.85rem]"
            >
              More Than{' '}
              <span style={{ color: ABOUT_COLORS.gold }}>Fireworks</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#062B63]/70 sm:text-[15px]">
              At Shanmuga&apos;s, we believe fireworks are more than products — they are emotions,
              traditions and cherished moments that bring families and communities together.
            </p>
          </div>
        </AnimateIn>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-3 md:gap-5 lg:mt-12 lg:gap-6">
          {CARDS.map((card, index) => (
            <AnimateIn key={card.title} animation="fade-up" delay={80 + index * 70} duration={700}>
              <article
                className={`about-purpose-card relative flex h-full flex-col items-center overflow-hidden rounded-2xl border text-center shadow-[0_8px_32px_rgba(6,43,99,0.1)] ${
                  card.featured ? 'border-[#C9A24A]/30' : 'border-[#062B63]/8'
                }`}
              >
                <img
                  src={ABOUT_IMAGES.purposeCardBg}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className={`absolute inset-0 ${
                    card.featured ? 'bg-[#F7F3EC]/72' : 'bg-white/75'
                  }`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full flex-col items-center px-6 py-10 sm:px-8 sm:py-12">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A24A]/35 bg-[#C9A24A]/12"
                    aria-hidden="true"
                  >
                    <card.icon className="h-6 w-6 text-[#C9A24A]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold text-[#062B63]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-[1.85] text-[#062B63]/75">{card.body}</p>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
