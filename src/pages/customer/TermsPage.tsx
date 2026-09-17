import { LegalDocumentLayout } from '@/components/customer/LegalDocumentLayout'
import { TERMS_META, TERMS_SECTIONS } from '@/lib/legalContent'

export function TermsPage() {
  return (
    <LegalDocumentLayout
      title={TERMS_META.title}
      seoDescription={TERMS_META.seoDescription}
      url={TERMS_META.url}
      effectiveDate={TERMS_META.effectiveDate}
      lastUpdated={TERMS_META.lastUpdated}
      intro={TERMS_META.intro}
      sections={TERMS_SECTIONS}
      heroChips={TERMS_META.heroChips}
      relatedPage={TERMS_META.relatedPage}
    />
  )
}
