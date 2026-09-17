import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, MessageCircle, Navigation, Send, Sparkles } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { EnquiryForm } from '@/components/customer/EnquiryForm'
import { ContactConnectPanel } from '@/components/contact/ContactConnectPanel'
import { useAuth } from '@/contexts/AuthContext'
import {
  BUSINESS_HOURS_24_7,
  BUSINESS_PHONE_NUMBERS,
  getCanonicalBusinessAddress,
  getCanonicalBusinessEmail,
  getWhatsAppNumbers,
} from '@/lib/businessInfo'
import {
  hasStoreMap,
  STORE_GOOGLE_MAPS_URL,
  STORE_MAP_EMBED_URL,
} from '@/lib/maps'
import {
  CONTACT_CARD_INNER_BG,
  CONTACT_PAGE_CONTENT_BG,
  CONTACT_PAGE_CONTENT_MOBILE_BG,
  CONTACT_PAGE_HERO_BG,
  CONTACT_PAGE_HERO_MOBILE_BG,
} from '@/lib/siteConfig'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'
import { cn } from '@/lib/utils'

export function ContactPage() {
  const { user, isCustomer } = useAuth()
  const whatsappNumbers = getWhatsAppNumbers()
  const phoneNumbers = BUSINESS_PHONE_NUMBERS
  const businessEmail = getCanonicalBusinessEmail()
  const businessAddress = getCanonicalBusinessAddress()
  const hours = BUSINESS_HOURS_24_7.weekdays

  const enquiryDefaults = useMemo(() => {
    if (!user || !isCustomer) return undefined
    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim() || ''
    const parts = fullName.split(/\s+/).filter(Boolean)
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' '),
      email: user.email || '',
      phone: (user.user_metadata?.phone as string | undefined) || '',
    }
  }, [user, isCustomer])

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact ${SHANMUGA_BRAND.displayName} via WhatsApp, phone, or visit our store in Virudhunagar.`}
        url="/contact"
      />

      <div className={cn('overflow-x-hidden', underNavPullClass)}>
        <header className="relative overflow-hidden border-b border-[#0F2847]/15">
          <img
            src={CONTACT_PAGE_HERO_MOBILE_BG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center md:hidden"
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
          <img
            src={CONTACT_PAGE_HERO_BG}
            alt=""
            className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-[right_center] md:block sm:object-[70%_center]"
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
          <div
            className={cn(
              'relative z-10 mx-auto max-w-7xl px-4 pb-10 text-left sm:px-6 sm:pb-14 lg:px-8 lg:pb-16',
              underNavTopPadClass,
            )}
          >
            <nav className="flex items-center justify-start gap-2 text-xs text-[#062B63]/65">
              <Link to="/" className="transition hover:text-[#0969D5]">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#062B63]">Contact</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-xl lg:max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/35 bg-[#C9A24A]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7A6348]">
                  <MessageCircle className="h-3.5 w-3.5" />
                  We&apos;re here to help
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-[#062B63] [text-shadow:0_1px_18px_rgba(255,255,255,0.85)] sm:text-4xl lg:text-5xl">
                  We&apos;d love to hear from you
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#062B63]/78 sm:text-base">
                  Send an enquiry using the form below, or message us on WhatsApp — we reply with prices, stock, and
                  delivery across India.
                </p>

                <div className="mt-5 flex flex-wrap justify-start gap-2">
                  {['WhatsApp', 'Phone', 'Email', 'Visit Us'].map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#062B63]/12 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#062B63] shadow-sm backdrop-blur-sm"
                    >
                      <Sparkles className="h-3 w-3 text-[#C9A24A]" />
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </header>

        <section className="relative overflow-hidden bg-[#F7F3EC] lg:bg-transparent">
          <img
            src={CONTACT_PAGE_CONTENT_MOBILE_BG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top lg:hidden"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <img
            src={CONTACT_PAGE_CONTENT_BG}
            alt=""
            className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center lg:block"
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#041E47] lg:hidden"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-4 sm:px-6 sm:pt-10 sm:pb-6 lg:px-8 lg:py-12">
            {/* Split contact card */}
            <div
              className="relative overflow-hidden rounded-2xl border border-[#0F2847]/10 bg-transparent shadow-[0_8px_40px_rgba(15,40,71,0.12)] lg:grid lg:grid-cols-2 lg:bg-white lg:overflow-visible"
              data-reveal="fade-up"
            >
              <div className="relative z-10 flex flex-col gap-0 lg:contents">
                <div className="relative overflow-hidden rounded-t-xl lg:contents">
                  <img
                    src={CONTACT_CARD_INNER_BG}
                    alt=""
                    className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center lg:hidden"
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />

                  <ContactConnectPanel
                    whatsappNumbers={whatsappNumbers}
                    phoneNumbers={phoneNumbers}
                    email={businessEmail}
                    address={businessAddress}
                    hours={hours}
                    mapsUrl={STORE_GOOGLE_MAPS_URL}
                  />
                </div>

                <div
                  id="enquiry-form"
                  className="relative z-10 overflow-visible rounded-b-xl bg-white px-4 py-5 sm:px-6 sm:py-7 lg:rounded-bl-none lg:rounded-r-2xl lg:px-10 lg:py-10"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/20 sm:h-11 sm:w-11">
                      <Send className="h-4 w-4 text-[#8B6914] sm:h-5 sm:w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-[#0F2847] sm:text-2xl">
                        Send an Inquiry
                      </h2>
                      <p className="mt-0.5 text-xs leading-snug text-[#0F2847]/65 sm:mt-1 sm:text-sm">
                        Fill in the form and we&apos;ll get back to you shortly.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <EnquiryForm
                      enquiryType="contact"
                      authUserId={user && isCustomer ? user.id : undefined}
                      defaults={enquiryDefaults}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              className="relative mt-5 overflow-hidden rounded-xl border border-[#0F2847]/10 bg-white shadow-md sm:mt-8 sm:rounded-2xl"
              data-reveal="fade-up"
            >
              <div className="relative min-h-[160px] sm:min-h-[300px] lg:min-h-[320px]">
                {hasStoreMap() ? (
                  <>
                    <iframe
                      title="Shanmugapriya Fire Works location"
                      src={STORE_MAP_EMBED_URL}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 bg-[#F7F3EC] px-4 text-center sm:min-h-[300px] sm:gap-3 sm:px-6">
                    <MapPin className="h-6 w-6 text-[#0F2847]/40 sm:h-8 sm:w-8" />
                    <p className="text-xs text-[#0F2847]/70 sm:text-sm">Map location coming soon</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2.5 border-t border-[#0F2847]/10 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-3.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0077B6] sm:h-4 sm:w-4" />
                  <p className="text-xs font-semibold leading-snug text-[#0F2847] sm:text-sm">
                    {SHANMUGA_BRAND.displayName} — Virudhunagar
                  </p>
                </div>
                {STORE_GOOGLE_MAPS_URL ? (
                  <a
                    href={STORE_GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0077B6] px-3 py-2 text-xs font-bold text-[#0F2847] transition hover:bg-[#0096D6] sm:w-auto sm:gap-2 sm:px-4 sm:text-sm"
                  >
                    <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Open in Google Maps
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
