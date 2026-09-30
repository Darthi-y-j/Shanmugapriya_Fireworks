import { SEO } from '@/components/shared/SEO'
import { PrimeHero } from '@/components/prime/PrimeHero'
import { PrimeServiceBar } from '@/components/prime/PrimeServiceBar'
import { PrimeCategoryGrid } from '@/components/prime/PrimeCategoryGrid'
import { HomeAboutSection } from '@/components/prime/HomeAboutSection'
import { HomeInternalLinksPanel } from '@/components/prime/HomeInternalLinksPanel'
import { HomePageSeoSection } from '@/components/prime/HomePageSeoSection'
import { HomeSocialMediaBar } from '@/components/prime/HomeSocialMediaBar'
import { HomePostAboutSections } from '@/components/prime/HomePostAboutSections'
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/siteConfig'
import { underNavPullClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

export function HomePage() {
  return (
    <>
      <SEO title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION} url="/" titleIsFull />
      <div className={cn('relative overflow-x-hidden bg-white', underNavPullClass)}>
        <PrimeHero />
        <HomeSocialMediaBar />
        <HomeInternalLinksPanel title="Browse our website" id="home-internal-links-top" />
        <PrimeCategoryGrid />
        <PrimeServiceBar />
        <HomeAboutSection />
        <HomePostAboutSections />
        <HomePageSeoSection />
        <HomeInternalLinksPanel title="More pages on this site" id="home-internal-links-bottom" />
      </div>
    </>
  )
}
