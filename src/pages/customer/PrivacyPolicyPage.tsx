import { LegalDocumentLayout } from '@/components/customer/LegalDocumentLayout'
import { PRIVACY_POLICY_META, PRIVACY_POLICY_SECTIONS } from '@/lib/legalContent'

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      title={PRIVACY_POLICY_META.title}
      seoDescription={PRIVACY_POLICY_META.seoDescription}
      url={PRIVACY_POLICY_META.url}
      effectiveDate={PRIVACY_POLICY_META.effectiveDate}
      lastUpdated={PRIVACY_POLICY_META.lastUpdated}
      intro={PRIVACY_POLICY_META.intro}
      sections={PRIVACY_POLICY_SECTIONS}
      closingNote={PRIVACY_POLICY_META.closingNote}
      heroChips={PRIVACY_POLICY_META.heroChips}
      relatedPage={PRIVACY_POLICY_META.relatedPage}
    />
  )
}
