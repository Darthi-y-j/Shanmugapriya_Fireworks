import { AnimateIn } from '@/components/customer/AnimateIn'
import { PRODUCTS_PAGE_BG_PATH } from '@/lib/siteConfig'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

export function PrimeProductsPageHero() {
  return (
    <section
      className={cn(
        'relative flex min-h-[40vh] items-end overflow-hidden sm:min-h-[46vh] lg:min-h-[50vh]',
        underNavPullClass,
      )}
    >
      <img
        src={PRODUCTS_PAGE_BG_PATH}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-[min(100%,42rem)] bg-gradient-to-r from-black/35 to-transparent"
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:pb-14',
          underNavTopPadClass,
        )}
      >
        <AnimateIn animation="fade-up" duration={700}>
          <div className="max-w-xl rounded-2xl border border-white/10 bg-black/20 px-5 py-5 backdrop-blur-[3px] sm:px-6 sm:py-6">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#F5D78E] drop-shadow-sm">
              <span className="h-px w-8 bg-[#E8C56A]" aria-hidden="true" />
              Our Catalogue
            </p>
            <h1
              className="mt-3 font-display text-[2.5rem] font-bold leading-[1.06] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-[3.2rem] lg:text-[3.75rem]"
            >
              Browse
              <br />
              <span className="text-[#F5D78E]">All Products</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/95 drop-shadow-sm sm:text-base">
              Select quantity, add to cart, and send your order on WhatsApp — wholesale and retail
              from Sivakasi.
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
