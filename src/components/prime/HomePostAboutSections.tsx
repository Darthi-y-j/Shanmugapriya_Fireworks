import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { HomePromoBanner } from '@/components/prime/HomePromoBanner'
import { HomeNewsletterCard } from '@/components/prime/HomeNewsletter'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'

/** Homepage sections shown after the About block — matches landing mockup flow */
export function HomePostAboutSections() {
  return (
    <>
      <section className="relative overflow-hidden pb-6 pt-3 sm:pb-8 sm:pt-5">
        <OptimizedBackground src={ABOUT_IMAGES.brandCardBg} priority={false} className="bg-[#F7F3EC]" />
        <div className="pointer-events-none absolute inset-0 bg-[#FFFCF7]/25" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <HomeNewsletterCard />
        </div>
      </section>
      <HomePromoBanner />
    </>
  )
}
