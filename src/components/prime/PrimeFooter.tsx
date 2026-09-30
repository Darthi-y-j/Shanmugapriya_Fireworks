import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, MapPin, Phone, Send, MessageCircle } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { NewsletterSubscribeForm } from '@/components/customer/NewsletterSubscribeForm'
import { OptimizedImage } from '@/components/customer/OptimizedImage'
import { CircularBrandLogo } from '@/components/prime/CircularBrandLogo'
import { DEVELOPER_CREDIT, FOOTER_BG, SITE_UI_LOGO_PATH } from '@/lib/siteConfig'
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
import { HOME_SEO_NAV_LINKS } from '@/lib/seoInternalLinks'
import { buildTelUrl, buildWhatsAppContactUrl } from '@/lib/whatsapp'

/** Shorter labels so the footer site map fits on one row on desktop. */
const FOOTER_SITEMAP_SHORT_LABEL: Record<string, string> = {
  'Shop all fireworks': 'Shop',
  'About Shanmuga Priya': 'About',
  'Contact & location': 'Contact',
  'Delivery information': 'Delivery',
  'Safety guide': 'Safety',
  'Why no online payment': 'Payment',
  'Shopping cart': 'Cart',
  'Saved favourites': 'Wishlist',
  'Customer login': 'Login',
  'Create account': 'Register',
  'Privacy policy': 'Privacy',
  'Terms of service': 'Terms',
}

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

/** Keeps phone digits readable over gold bokeh in the footer artwork (thin "1" strokes pick up background). */
const FOOTER_PHONE_TEXT =
  'font-sans tabular-nums antialiased [text-shadow:0_0_12px_rgba(4,30,71,0.95),0_1px_2px_rgba(4,30,71,0.9)]'

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

      <div
        className="mt-3 space-y-2 rounded-lg border border-white/10 bg-[#041E47]/80 px-2.5 py-2.5 backdrop-blur-sm sm:mt-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
          {phoneNumbers.map((number) => (
            <a
              key={number}
              href={buildTelUrl(number)}
              className={`inline-flex items-center gap-2 text-xs font-medium text-white/90 transition hover:text-white ${FOOTER_PHONE_TEXT}`}
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
            className={`inline-flex items-center gap-2 text-xs font-medium text-[#4ADE80] transition hover:text-[#86EFAC] ${FOOTER_PHONE_TEXT}`}
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
  const whatsappHref = whatsappNumber
    ? buildWhatsAppContactUrl(
        whatsappNumber,
        'Hi Shanmuga Priya Crackers, I would like to enquire about your products.',
      )
    : ''

  return (
    <footer className="relative overflow-hidden bg-[#041E47]">
      <OptimizedImage
        src={FOOTER_BG}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#041E47]/45 via-[#041E47]/35 to-[#041E47]/55"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-9">
        <div className="flex flex-col gap-7 sm:gap-8 lg:grid lg:grid-cols-5 lg:gap-6 lg:items-start">
          {/* Brand */}
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3">
              <img
                src={SITE_UI_LOGO_PATH}
                alt={SHANMUGA_BRAND.displayName}
                width={48}
                height={48}
                className="h-11 w-11 rounded-full border-2 border-[#C9A24A]/90 object-cover shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:h-12 sm:w-12"
                loading="lazy"
                decoding="async"
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
                <SocialIcon
                  href={whatsappHref}
                  label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md shadow-green-900/30 transition hover:brightness-110"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                    />
                  </svg>
                </SocialIcon>
            </div>
          </div>

          {/* Newsletter + contact */}
          <div className="min-w-0">
            <FooterUpdatesColumn phoneNumbers={phoneNumbers} whatsappNumber={whatsappNumber} />
          </div>
        </div>

        <nav
          className="mt-3 border-t border-white/10 pt-2.5 sm:mt-4 sm:pt-3"
          aria-label="All pages on this website"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">Site map</p>
          <ul
            className="mt-1 flex flex-nowrap items-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {HOME_SEO_NAV_LINKS.map((item, index) => {
              const label = FOOTER_SITEMAP_SHORT_LABEL[item.label] ?? item.label
              return (
                <li key={item.href} className="flex shrink-0 items-center">
                  <a
                    href={item.href}
                    className="whitespace-nowrap px-0.5 text-[10px] text-white/75 underline-offset-2 hover:text-[#E8C56A] hover:underline sm:text-[11px]"
                  >
                    {label}
                  </a>
                  {index < HOME_SEO_NAV_LINKS.length - 1 ? (
                    <span className="px-1.5 text-[10px] text-white/35 select-none sm:px-2" aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom bar */}
        <div className="mt-3 flex flex-col items-center gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-3.5">
          <div className="text-center sm:text-left">
            <p className="text-[11px] text-white/70">
              © {year} {businessName}. All rights reserved.
            </p>
            <p className="mt-1.5 text-[10px] text-white/55 sm:text-[11px]">
              {DEVELOPER_CREDIT.label}{' '}
              <a
                href={DEVELOPER_CREDIT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold tracking-wide text-[#E8C56A] underline decoration-[#C9A24A]/60 underline-offset-2 transition hover:text-white hover:decoration-[#E8C56A]"
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
