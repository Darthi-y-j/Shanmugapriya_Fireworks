import { HomePromoBanner } from '@/components/prime/HomePromoBanner'
import { HomeNewsletterCard } from '@/components/prime/HomeNewsletter'

/** Homepage sections shown after the About block — matches landing mockup flow */
export function HomePostAboutSections() {
  return (
    <>
      <HomePromoBanner />
      <section className="relative overflow-hidden py-8 sm:py-12 lg:py-14">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <HomeNewsletterCard />
        </div>
      </section>
    </>
  )
}
