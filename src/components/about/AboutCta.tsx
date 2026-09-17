import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'

export function AboutCta() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="about-cta-heading">
      <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
        <img
          src={ABOUT_IMAGES.ctaBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="relative z-10 flex min-h-[360px] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[420px] sm:px-6 sm:py-20 lg:min-h-[480px]">
          <AnimateIn animation="fade-up" duration={800}>
            <h2
              id="about-cta-heading"
              className="max-w-3xl font-display text-[2rem] font-bold leading-[1.12] text-[#062B63] sm:text-[2.5rem] lg:text-[3rem]"
            >
              Let&apos;s Create Brighter
              <br />
              Moments Together
            </h2>
            <span className="mx-auto mt-5 block h-px w-16 bg-[#C9A24A]" aria-hidden="true" />
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C9A24A] px-8 py-3.5 text-sm font-semibold text-[#062B63] shadow-[0_12px_40px_rgba(201,162,74,0.35)] transition hover:brightness-110"
            >
              Explore Our Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
