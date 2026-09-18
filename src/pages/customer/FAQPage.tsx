import { Link } from 'react-router-dom'
import { HelpCircle, MessageCircle, ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'

import {
  FAQ_ITEM_BG,
  FAQ_PAGE_CONTENT_BG,
  FAQ_PAGE_CONTENT_MOBILE_BG,
  FAQ_PAGE_HERO_BG,
} from '@/lib/siteConfig'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse products, add them to your cart, then go to Cart and tap "Send Enquiry on WhatsApp". Our team confirms availability, pricing, and delivery. There is no online payment.',
  },
  {
    q: 'Is there online payment?',
    a: 'We accept pre-payment only. After you send an enquiry, our team shares payment details and confirms your order before dispatch.',
  },
  {
    q: 'Can I enquire about multiple products?',
    a: 'Yes. Add multiple products to your cart, then send one combined WhatsApp enquiry with all items listed.',
  },
  {
    q: 'Are prices on the website final?',
    a: 'Prices shown are indicative. Send an enquiry and our team will provide current rates and stock.',
  },
  {
    q: 'Do you deliver across India?',
    a: 'Yes. Share your location on WhatsApp — we confirm delivery availability and charges for your area.',
  },
  {
    q: 'Is it safe to buy fireworks online?',
    a: 'We are a catalogue and enquiry platform. Orders are handled offline via WhatsApp with proper safety guidance.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: 'Minimums vary by product. Enquire on WhatsApp for the item you need and we will confirm.',
  },
  {
    q: 'How quickly will you respond?',
    a: 'We reply on WhatsApp 24/7. Most enquiries get a response within minutes, including festival season.',
  },
]

const topicChips = ['Ordering', 'Pricing', 'Delivery', 'Safety & Support']

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#C9A24A]/25 shadow-sm transition hover:border-[#C9A24A]/45 hover:shadow-md">
      <OptimizedBackground src={FAQ_ITEM_BG} priority={false} />
      <details className="group relative z-10">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 marker:content-none sm:px-5 sm:py-5 [&::-webkit-details-marker]:hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C9A24A] font-display text-xs font-extrabold text-[#0F2847]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1 font-display text-base font-bold leading-snug text-white sm:text-lg">
            {faq.q}
          </span>
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-[#E8C547]/70 transition-transform duration-300 group-open:rotate-180 group-open:text-[#E8C547]" />
        </summary>
        <div className="border-t border-white/15 px-4 py-4 text-sm leading-relaxed text-white/85 sm:px-5 sm:pl-[3.85rem]">
          {faq.a}
        </div>
      </details>
    </div>
  )
}

export function FAQPage() {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about browsing products and sending enquiries at Shanmuga Priya Crackers."
        url="/faq"
      />

      <div className={cn('overflow-x-hidden', underNavPullClass)}>
        <header className="relative overflow-hidden">
          <OptimizedBackground src={FAQ_PAGE_HERO_BG} priority />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#F7F3EC]/45 via-[#F7F3EC]/20 to-[#F7F3EC]/35"
            aria-hidden="true"
          />

          <div
            className={cn(
              'relative z-10 mx-auto max-w-7xl px-4 pb-10 text-center sm:px-6 sm:pb-14 lg:px-8 lg:pb-16',
              underNavTopPadClass,
            )}
          >
            <nav className="flex items-center justify-center gap-2 text-xs text-[#062B63]/65">
              <Link to="/" className="transition hover:text-[#0969D5]">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#062B63]">FAQ</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mx-auto mt-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/35 bg-[#C9A24A]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A6348]">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Help Centre
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-[#062B63] sm:text-4xl lg:text-5xl">
                  Frequently Asked <span className="text-[#C9A24A]">Questions</span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#062B63]/78 sm:text-base">
                  Clear answers on ordering, pricing, delivery, and enquiries — shop with confidence.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {topicChips.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-[#062B63]/12 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#062B63] shadow-sm backdrop-blur-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </header>

        <section className="relative overflow-hidden py-10 sm:py-12">
          <OptimizedBackground
            src={FAQ_PAGE_CONTENT_MOBILE_BG}
            fit="fill"
            priority={false}
            className="md:hidden"
          />
          <OptimizedBackground
            src={FAQ_PAGE_CONTENT_BG}
            fit="fill"
            priority={false}
            className="hidden md:block"
          />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {faqs.map((faq, i) => (
                <AnimateIn key={faq.q} animation="fade-up" delay={40 + i * 30} className="h-full">
                  <FAQItem faq={faq} index={i} />
                </AnimateIn>
              ))}
            </div>

            <AnimateIn animation="fade-up" delay={300}>
              <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#0F2847]/15 bg-gradient-to-r from-[#0F2847] to-[#1A3D66] shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-[#0077B6] sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-extrabold uppercase text-white sm:text-2xl">
                      Still have questions?
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                      Message us on WhatsApp 24/7 for product details, pricing, or delivery info.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, 'Hello! I have a question.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0077B6] px-5 py-2.5 text-sm font-bold text-[#0F2847] transition hover:bg-[#0096D6]"
                    >
                      Contact Us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}
