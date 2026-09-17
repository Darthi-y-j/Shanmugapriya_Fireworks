import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, MessageCircle, Truck } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { PageHeader } from '@/components/customer/PageHeader'
import { FestivePageBackground } from '@/components/customer/FestivePageBackground'
import { useSettings } from '@/contexts/SettingsContext'
import { getBusinessPolicies, getWhatsAppNumbers } from '@/lib/businessInfo'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'

const STEPS = [
  'Add crackers to your cart on the website.',
  'Send your cart on WhatsApp with your delivery address.',
  'Our team confirms stock, price, and delivery charges for your location.',
  'After confirmation, we arrange dispatch across India as per regulations.',
] as const

export function DeliveryPage() {
  const { settings } = useSettings()
  const policies = getBusinessPolicies(settings)
  const whatsapp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="Delivery Information"
        description="Shanmuga Priya Crackers delivers across India. Learn how ordering and delivery works."
        url="/delivery"
      />

      <FestivePageBackground>
        <PageHeader as="section" contentClassName="px-4 py-10 text-center sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077B6]">Delivery</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl">
            All-India Delivery
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            We deliver crackers across India. Share your location on WhatsApp and we&apos;ll confirm
            availability and charges.
          </p>
        </PageHeader>

        <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#0F2847]/10 bg-white p-5 shadow-sm">
              <Truck className="h-8 w-8 text-[#0F2847]" />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#0F2847]/55">
                Coverage
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-[#0F2847]">
                {policies.delivery_areas}
              </p>
            </div>
            <div className="rounded-2xl border border-[#0F2847]/10 bg-white p-5 shadow-sm">
              <MapPin className="h-8 w-8 text-[#0077B6]" />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#0F2847]/55">
                Based in
              </p>
              <p className="mt-1 text-sm font-semibold text-[#0F2847]">Sivakasi, Tamil Nadu</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#0F2847]/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-extrabold uppercase text-[#0F2847]">
              How delivery works
            </h2>
            <ol className="mt-4 space-y-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-[#0F2847]/85">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6] text-xs font-bold text-[#0F2847]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {whatsapp && (
            <a
              href={buildWhatsAppContactUrl(whatsapp, 'Hi Shanmuga Priya Crackers, I need delivery information for my location.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#1da851]"
            >
              <MessageCircle className="h-5 w-5" />
              Ask about delivery on WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          )}

          <p className="text-center text-xs text-[#0F2847]/55">
            <Link to="/account/help" className="font-semibold text-[#0F2847] hover:text-[#0077B6]">
              Back to Help &amp; Support
            </Link>
          </p>
        </div>
      </FestivePageBackground>
    </>
  )
}
