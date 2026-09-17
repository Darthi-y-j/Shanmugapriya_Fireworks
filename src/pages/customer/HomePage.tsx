import { SEO } from '@/components/shared/SEO'
import { PrimeHero } from '@/components/prime/PrimeHero'
import { PrimeServiceBar } from '@/components/prime/PrimeServiceBar'
import { PrimeCategoryGrid } from '@/components/prime/PrimeCategoryGrid'
import { HomeAboutSection } from '@/components/prime/HomeAboutSection'
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
        <PrimeCategoryGrid />
        <PrimeServiceBar />
        <HomeAboutSection />
        <HomePostAboutSections />
      </div>
    </>
  )
}
