import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { HOME_IMAGES } from '@/lib/homeImages'

export function HomePromoBanner() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="home-promo-heading">
      <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
        <OptimizedImage
          src={HOME_IMAGES.promoBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#041E47]/82 via-[#062B63]/50 to-[#041E47]/35"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex h-full min-h-[320px] max-w-7xl items-center px-4 py-12 sm:min-h-[380px] sm:px-6 sm:py-14 lg:min-h-[420px]">
          <AnimateIn animation="slide-in-left" duration={800}>
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#C9A24A]/90">
                Make Every Occasion
              </p>
              <h2
                id="home-promo-heading"
                className="mt-3 font-display text-[2rem] font-bold leading-[1.1] text-white sm:text-[2.5rem] lg:text-[2.85rem]"
              >
                Brighter Together
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-[15px]">
                From family celebrations to grand festivals — discover fireworks crafted with care,
                safety and the spirit of Sivakasi.
              </p>
              <Link
                to="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9A24A] px-8 py-3.5 text-sm font-bold text-[#062B63] shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition hover:brightness-110 sm:px-9 sm:py-4"
              >
                Explore All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
