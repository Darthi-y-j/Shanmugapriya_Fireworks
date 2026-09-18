import { ArrowRight, Flower2 } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { NewsletterSubscribeForm } from '@/components/customer/NewsletterSubscribeForm'
import { HOME_IMAGES } from '@/lib/homeImages'

export function HomeNewsletterCard() {
  return (
    <AnimateIn animation="fade-up" delay={280} duration={800}>
      <div
        className="relative mt-6 overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(6,43,99,0.22)] sm:mt-14 sm:rounded-[2rem] sm:shadow-[0_20px_60px_rgba(6,43,99,0.28)]"
        aria-labelledby="home-newsletter-heading"
      >
        <OptimizedImage
          src={HOME_IMAGES.serviceBarBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#041E47]/25" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A24A]/55 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A24A]/55 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-4 px-4 py-5 sm:gap-8 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-14">
          <div className="max-w-md lg:max-w-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9A24A]/40 bg-[#C9A24A]/10 sm:h-10 sm:w-10"
                aria-hidden="true"
              >
                <Flower2 className="h-4 w-4 text-[#E8C56A] sm:h-5 sm:w-5" strokeWidth={1.5} />
              </span>
              <h3
                id="home-newsletter-heading"
                className="font-display text-lg font-bold text-white sm:text-[1.75rem] lg:text-3xl"
              >
                Join Our Celebration
              </h3>
            </div>
            <p className="mt-2 text-xs leading-snug text-white/82 sm:mt-4 sm:text-[15px] sm:leading-relaxed">
              Get festival offers, new arrivals and celebration tips delivered straight to your inbox.
            </p>
            <span className="mt-3 block h-px w-10 bg-[#C9A24A]/70 sm:mt-5 sm:w-14" aria-hidden="true" />
          </div>

          <NewsletterSubscribeForm
            source="home"
            className="relative w-full max-w-xl lg:max-w-md lg:shrink-0"
            inputClassName="w-full rounded-full border-0 bg-white py-2.5 pl-4 pr-[6.75rem] text-xs text-[#062B63] shadow-[0_6px_24px_rgba(0,0,0,0.15)] outline-none ring-2 ring-white/20 placeholder:text-[#062B63]/40 focus:ring-[#C9A24A]/60 disabled:opacity-70 sm:py-[1.05rem] sm:pl-7 sm:pr-36 sm:text-sm sm:shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
            buttonClassName="absolute right-1 top-1 bottom-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#C9A24A] px-3 text-[11px] font-semibold text-[#062B63] transition hover:brightness-110 disabled:opacity-70 sm:right-1.5 sm:top-1.5 sm:bottom-1.5 sm:gap-1.5 sm:px-6 sm:text-sm"
            buttonContent={
              <>
                Subscribe
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            }
          />
        </div>
      </div>
    </AnimateIn>
  )
}
