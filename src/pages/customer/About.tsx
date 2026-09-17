import { SEO } from '@/components/shared/SEO'
import { useSettings } from '@/contexts/SettingsContext'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutPurpose } from '@/components/about/AboutPurpose'
import { AboutTrustStrip } from '@/components/about/AboutTrustStrip'
import { AboutStory } from '@/components/about/AboutStory'
import { AboutBrands } from '@/components/about/AboutBrands'
import { AboutWhyChoose } from '@/components/about/AboutWhyChoose'
import { AboutCta } from '@/components/about/AboutCta'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { underNavPullClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

export function About() {
  const { settings } = useSettings()
  const businessName = settings.business_name || SHANMUGA_BRAND.displayName

  return (
    <>
      <SEO
        title="About Us"
        description={`About ${businessName} — A premium Sivakasi fireworks brand rooted in tradition, quality and celebration.`}
        url="/about"
      />

      <div className={cn('about-page relative overflow-x-hidden bg-white', underNavPullClass)}>
        <AboutHero />
        <AboutPurpose />
        <AboutTrustStrip />
        <AboutStory />
        <AboutBrands />
        <AboutWhyChoose />
        <AboutCta />
      </div>
    </>
  )
}

/** @deprecated Use About — kept for existing route imports */
export const AboutPage = About
