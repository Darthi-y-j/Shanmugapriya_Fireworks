import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const STORAGE_KEY = 'shanmuga-important-notice-accepted'

const howItWorksSteps = [
  'Browse our fireworks catalogue.',
  'Add your required products to the enquiry list.',
  'Submit your enquiry with your contact details.',
  'Our team will contact you to confirm availability and requirements.',
  'Your order will be processed only through the applicable legal and regulatory procedure.',
]

export function ImportantNoticeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const accepted = sessionStorage.getItem(STORAGE_KEY)
    if (!accepted) {
      setOpen(true)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleAccept = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setOpen(false)
    document.body.style.overflow = ''
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="important-notice-title"
    >
      <div className="animate-scale-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gold-400/20 bg-cream-50 shadow-2xl shadow-black/40">
        <div className="border-b border-navy-900/10 bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/30">
              <AlertTriangle className="h-5 w-5 text-gold-400" />
            </div>
            <h2
              id="important-notice-title"
              className="font-display text-xl font-semibold text-cream-50 sm:text-2xl"
            >
              Important Notice
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
          <div className="space-y-4 text-sm leading-relaxed text-navy-800 sm:text-[0.9375rem]">
            <p>
              Please note that fireworks are subject to applicable laws, regulations, licensing
              requirements, and directions issued by the relevant authorities.
            </p>

            <p>
              <strong className="font-semibold text-navy-900">
                Online purchase and direct payment for fireworks are not available through this
                website.
              </strong>{' '}
              You may browse our product catalogue, select the products you are interested in, and
              submit an <strong className="font-semibold text-navy-900">Enquiry</strong> with your
              required quantities.
            </p>

            <p>
              Once your enquiry is submitted, our team will contact you through{' '}
              <strong className="font-semibold text-navy-900">WhatsApp or phone</strong> to discuss
              product availability, pricing, delivery or collection arrangements, and the applicable
              requirements for your location.
            </p>

            <p>
              We are committed to supplying only products that are permitted under applicable
              regulations and to following the required safety, licensing, transportation, and
              statutory requirements.
            </p>

            <div className="rounded-xl border border-navy-900/10 bg-white p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-festive-600">
                How it works
              </h3>
              <ol className="mt-3 space-y-2.5">
                {howItWorksSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-bold text-festive-600 ring-1 ring-gold-400/25">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="font-medium text-navy-900">
              Thank you for choosing us and for celebrating responsibly.
            </p>

            <p className="text-xs italic text-navy-700/80 sm:text-sm">
              Product availability and fulfilment are subject to applicable laws, local
              restrictions, licensing requirements, and regulatory directions.
            </p>
          </div>
        </div>

        <div className="border-t border-navy-900/10 bg-cream-100/80 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={handleAccept}
            className="w-full rounded-xl bg-gradient-to-r from-festive-500 to-gold-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-festive-500/25 transition hover:from-festive-400 hover:to-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
          >
            I Understand — Continue to Website
          </button>
        </div>
      </div>
    </div>
  )
}
