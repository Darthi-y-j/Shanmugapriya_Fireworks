import { Diamond, Heart, Sparkles, Truck } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { HOME_IMAGES } from '@/lib/homeImages'

const ITEMS = [
  { icon: Diamond, title: 'Premium Quality', desc: 'Safe & Certified' },
  { icon: Truck, title: 'Fast & Reliable Delivery', desc: 'Across India' },
  { icon: Sparkles, title: 'Wide Range', desc: 'For Every Celebration' },
  { icon: Heart, title: 'Trusted by Families', desc: 'Lighting Happiness Since 1999' },
] as const

export function PrimeServiceBar() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="trust-bar-heading">
      <OptimizedImage
        src={HOME_IMAGES.serviceBarBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <h2 id="trust-bar-heading" className="sr-only">Why customers trust us</h2>

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12">
        <ul className="grid grid-cols-4 divide-x divide-white/15">
          {ITEMS.map((item, i) => {
            const Icon = item.icon
            return (
              <li key={item.title} className="relative px-1.5 sm:px-5">
                <AnimateIn
                  animation="fade-up"
                  delay={i * 70}
                  duration={600}
                  className="flex flex-col items-center gap-1.5 text-center sm:gap-3"
                >
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#C9A24A] sm:h-8 sm:w-8"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-[10px] font-bold leading-tight text-white sm:text-base sm:leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[8px] leading-tight text-white/70 sm:mt-1.5 sm:text-xs sm:leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </AnimateIn>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
