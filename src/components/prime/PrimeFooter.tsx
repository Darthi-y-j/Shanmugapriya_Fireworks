import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, MapPin, Phone, Send, MessageCircle } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { NewsletterSubscribeForm } from '@/components/customer/NewsletterSubscribeForm'
import { CircularBrandLogo } from '@/components/prime/CircularBrandLogo'
import { DEVELOPER_CREDIT, FOOTER_BG, SITE_LOGO_PATH } from '@/lib/siteConfig'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { BRAND_PARTNERS } from '@/lib/brandPartners'
import {
  BUSINESS_ADDRESS,
  BUSINESS_PHONE_NUMBERS,
  formatAddressInline,
  formatDisplayPhone,
  getWhatsAppNumbers,
} from '@/lib/businessInfo'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'
import { buildTelUrl, buildWhatsAppContactUrl } from '@/lib/whatsapp'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/safety', label: 'Safety' },
  { to: '/contact', label: 'Contact' },
] as const

const SUPPORT_LINKS = [
  { to: '/account/enquiries', label: 'Track Order' },
  { to: '/delivery', label: 'Shipping Policy' },
  { to: '/terms', label: 'Returns & Refunds' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Help Center' },
] as const

const COLUMN_TITLE = 'font-display text-xs font-bold text-white sm:text-sm lg:text-[15px]'

const FOOTER_LINK = 'text-xs text-white/85 transition hover:text-[#E8C56A] sm:text-sm'

function FooterUpdatesColumn({
  phoneNumbers,
  whatsappNumber,
}: {
  phoneNumbers: string[]
  whatsappNumber?: string
}) {
  return (
    <div>
      <p className={COLUMN_TITLE}>Get Festive Updates</p>
      <p className="mt-1.5 text-[11px] leading-snug text-white/75 sm:text-xs">
        Subscribe for exclusive offers and new arrivals
      </p>
      <NewsletterSubscribeForm
        source="footer"
        className="relative mt-2.5 sm:mt-3"
        inputClassName="w-full rounded-lg border-0 bg-white py-2 pl-3 pr-11 text-xs text-[#062B63] outline-none ring-1 ring-white/10 placeholder:text-[#062B63]/40 focus:ring-[#C9A24A]/50 disabled:opacity-70 sm:py-2.5 sm:pl-4 sm:pr-12 sm:text-sm"
        buttonClassName="absolute right-1 top-1 bottom-1 flex w-10 items-center justify-center rounded-md bg-[#C9A24A] text-[#062B63] transition hover:brightness-110 disabled:opacity-70"
        buttonContent={<Send className="h-4 w-4" />}
      />

      <div className="mt-3 space-y-2 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
          {phoneNumbers.map((number) => (
            <a
              key={number}
              href={buildTelUrl(number)}
              className="inline-flex items-center gap-2 text-xs font-medium text-white/85 transition hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#7ECEF3]" aria-hidden="true" />
              {formatDisplayPhone(number)}
            </a>
          ))}
        </div>
        {whatsappNumber ? (
          <a
            href={buildWhatsAppContactUrl(
              whatsappNumber,
              'Hi Shanmuga Priya Crackers, I would like to enquire about your products.',
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#4ADE80] transition hover:text-[#86EFAC]"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            WhatsApp {formatDisplayPhone(whatsappNumber)}
          </a>
        ) : null}
      </div>
    </div>
  )
}

function SocialIcon({
  href,
  label,
  children,
  className,
}: {
  href?: string
  label: string
  children: ReactNode
  className: string
}) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
      >
        {children}
      </a>
    )
  }

  return (
    <span className={`${className} cursor-default`} title={`${label} — coming soon`} aria-label={label}>
      {children}
    </span>
  )
}

export function PrimeFooter() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()
  const businessName = SHANMUGA_BRAND.displayName
  const skyFairy = BRAND_PARTNERS[0]
  const phoneNumbers = [...BUSINESS_PHONE_NUMBERS]
  const whatsappNumber = getWhatsAppNumbers(settings)[0]
  const displayAddress =
    settings.address && !settings.address.includes('[Shop address')
      ? settings.address
      : BUSINESS_ADDRESS
  const instagram = settings.social_links.instagram?.trim()
  const facebook = settings.social_links.facebook?.trim()
  const youtube = settings.social_links.youtube?.trim()

  return (
    <footer className="relative overflow-hidden bg-[#041E47]">
      <img
        src={FOOTER_BG}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[#041E47]/15"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-9">
        <div className="flex flex-col gap-7 sm:gap-8 lg:grid lg:grid-cols-5 lg:gap-6 lg:items-start">
          {/* Brand */}
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3">
              <img
                src={SITE_LOGO_PATH}
                alt={SHANMUGA_BRAND.displayName}
                className="h-11 w-11 rounded-full border-2 border-[#C9A24A]/90 object-cover shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:h-12 sm:w-12"
              />
              <div>
                <p className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white sm:text-base">
                  {SHANMUGA_BRAND.shortName}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  {SHANMUGA_BRAND.tagline}
                </p>
              </div>
            </Link>

            <a
              href={STORE_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex max-w-md items-start gap-2 text-xs leading-relaxed text-white/85 transition hover:text-[#E8C56A] sm:mt-4 sm:text-sm"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24A]" aria-hidden="true" />
              <span>{formatAddressInline(displayAddress)}</span>
            </a>

            {skyFairy ? (
              <div className="mt-3 flex items-center gap-2.5 sm:mt-4">
                <CircularBrandLogo
                  src={skyFairy.logo}
                  alt={`${skyFairy.name} logo`}
                  className="h-8 w-8 border border-white/10 p-0.5"
                />
                <p className="text-xs leading-snug text-white/70">
                  Also home to <span className="font-semibold text-white">{skyFairy.name}</span>
                </p>
              </div>
            ) : null}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-10 lg:contents">
            <nav aria-label="Quick links" className="min-w-0">
              <p className={COLUMN_TITLE}>Quick Links</p>
              <ul className="mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={FOOTER_LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Customer support" className="min-w-0">
              <p className={COLUMN_TITLE}>Customer Support</p>
              <ul className="mt-2 space-y-1.5 sm:mt-2.5 sm:space-y-2">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={FOOTER_LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social */}
          <div className="min-w-0">
            <p className={COLUMN_TITLE}>Stay Connected</p>
            <div className="mt-2.5 flex items-center gap-2.5 sm:mt-3">
                <SocialIcon
                  href={instagram}
                  label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#E8C56A] bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md transition hover:brightness-110"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href={facebook}
                  label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md shadow-blue-900/40 transition hover:brightness-110"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13 10h3l-.5 3H13v9h-3v-9H7v-3h3V7.5C10 5 11.5 3 14.5 3H17v3h-2c-1 0-2 .5-2 2V10z" />
                  </svg>
                </SocialIcon>
                <SocialIcon
                  href={youtube}
                  label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF0000] text-white shadow-md shadow-red-900/40 transition hover:brightness-110"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M10 15.5v-7l6 3.5-6 3.5z" />
                  </svg>
                </SocialIcon>
            </div>
          </div>

          {/* Newsletter + contact */}
          <div className="min-w-0">
            <FooterUpdatesColumn phoneNumbers={phoneNumbers} whatsappNumber={whatsappNumber} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pt-5">
          <div className="text-center sm:text-left">
            <p className="text-[11px] text-white/70">
              © {year} {businessName}. All rights reserved.
            </p>
            <p className="mt-1.5 text-[10px] text-white/50">
              {DEVELOPER_CREDIT.label}{' '}
              <a
                href={DEVELOPER_CREDIT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white/70"
              >
                {DEVELOPER_CREDIT.name}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-white/65 sm:justify-end">
            <Link to="/privacy" className="transition hover:text-[#E8C56A]">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="hidden sm:inline">|</span>
            <Link to="/terms" className="transition hover:text-[#E8C56A]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-3 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A24A] text-[#062B63] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition hover:brightness-110 sm:right-6"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </footer>
  )
}
