import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import {
  CartLikesHero,
  CartLikesPageShell,
  cartLikesHeroBadgeClass,
  cartLikesHeroMutedClass,
  cartLikesHeroTitleClass,
} from '@/components/customer/CartLikesHero'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'
import {
  paymentPolicyHowItWorks,
  paymentPolicyIntroParagraphs,
  paymentPolicyPageSections,
} from '@/lib/paymentPolicyContent'

export function PaymentPolicyPage() {
  const { settings } = useSettings()
  const whatsapp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="Why No Online Payment"
        description="Learn why Shanmuga Priya Crackers uses WhatsApp enquiry and pre-payment instead of online checkout for fireworks orders."
        url="/why-no-online-payment"
      />

      <CartLikesPageShell>
        <CartLikesHero contentClassName="px-4 py-10 text-center sm:px-6">
          <p className={cartLikesHeroBadgeClass}>Payment</p>
          <h1 className={cn('mt-3', cartLikesHeroTitleClass)}>Why No Online Payment?</h1>
          <p className={cn('mx-auto mt-3 max-w-lg', cartLikesHeroMutedClass)}>
            We use WhatsApp enquiry and pre-payment so every order is confirmed for your location
            before you pay.
          </p>
        </CartLikesHero>

        <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-[#0F2847]/10 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-8 w-8 shrink-0 text-[#0F2847]" />
              <div>
                <h2 className="font-display text-lg font-extrabold uppercase text-[#0F2847]">
                  Enquiry first, payment after confirmation
                </h2>
                <div className="mt-3 space-y-3">
                  {paymentPolicyIntroParagraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-[#0F2847]/85">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {paymentPolicyPageSections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-[#0F2847]/10 bg-white p-6 shadow-sm"
            >
              <h2 className="font-display text-lg font-extrabold uppercase text-[#0F2847]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-[#0F2847]/85">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-[#0F2847]/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-extrabold uppercase text-[#0F2847]">
              Step-by-step
            </h2>
            <ol className="mt-4 space-y-3">
              {paymentPolicyHowItWorks.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-[#0F2847]/85">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0077B6] text-xs font-bold text-[#0F2847]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {whatsapp && (
              <a
                href={buildWhatsAppContactUrl(
                  whatsapp,
                  'Hi Shanmuga Priya Crackers, I have a question about payment and ordering.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:brightness-105"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
            <Link
              to="/cart"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0F2847]/15 bg-white px-5 py-3 text-sm font-bold text-[#0F2847] transition hover:border-[#0077B6]/50 hover:bg-[#0077B6]/10"
            >
              Go to Cart
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CartLikesPageShell>
    </>
  )
}
