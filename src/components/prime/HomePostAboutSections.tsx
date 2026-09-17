import { HomePromoBanner } from '@/components/prime/HomePromoBanner'
import { HomeTestimonials } from '@/components/prime/HomeTestimonials'

/** Homepage sections shown after the About block — matches landing mockup flow */
export function HomePostAboutSections() {
  return (
    <>
      <HomePromoBanner />
      <HomeTestimonials />
    </>
  )
}
