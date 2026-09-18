import type { ReactNode } from 'react'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { CONTACT_CONNECT_BG } from '@/lib/siteConfig'
import { buildMailtoUrl, buildTelUrl, buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { formatAddressInline, formatDisplayPhone } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

const WHATSAPP_GREETING =
  'Hi Shanmuga Priya Crackers, I would like to enquire about your products.'

function ContactRow({
  icon: Icon,
  label,
  accent = '#C9A227',
  children,
  className,
}: {
  icon: typeof Phone
  label: string
  accent?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex gap-2.5 border-b border-white/10 py-3 last:border-b-0 sm:gap-4 sm:py-5 lg:border-white/10',
        className,
      )}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm sm:h-11 sm:w-11 sm:rounded-xl"
        style={{ color: accent }}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]"
          style={{ color: accent }}
        >
          {label}
        </p>
        <div className="mt-1 space-y-0.5 sm:mt-1.5 sm:space-y-1">{children}</div>
      </div>
    </div>
  )
}

interface ContactConnectPanelProps {
  whatsappNumbers: string[]
  phoneNumbers: string[]
  email?: string
  address?: string
  hours: string
  mapsUrl?: string | null
}

const linkClass =
  'block text-xs font-semibold leading-snug text-white/90 transition hover:text-[#E8C97A] sm:text-base lg:hover:text-[#E8C547]'

const bodyClass =
  'text-xs leading-snug text-white/85 sm:text-sm sm:leading-relaxed lg:text-white/90'

export function ContactConnectPanel({
  whatsappNumbers,
  phoneNumbers,
  email,
  address,
  hours,
  mapsUrl,
}: ContactConnectPanelProps) {
  return (
    <div className="relative z-10 flex min-h-0 flex-col justify-center overflow-hidden rounded-t-xl bg-transparent p-4 sm:min-h-[320px] sm:p-6 lg:rounded-l-2xl lg:rounded-tr-none lg:p-10">
      <OptimizedBackground
        src={CONTACT_CONNECT_BG}
        priority
        className="hidden lg:block"
      />

      <div className="relative z-10">
        <h2 className="font-display text-lg font-extrabold text-white sm:text-3xl">
          Connect With Us
        </h2>
        <p className="mt-1 max-w-md text-xs leading-snug text-white/75 sm:mt-2 sm:text-sm sm:leading-relaxed">
          Share your requirements. We&apos;ll handle the rest — quotes, bulk orders, and delivery.
        </p>

        <div className="mt-3 sm:mt-6">
          {whatsappNumbers.length > 0 && (
            <ContactRow icon={MessageCircle} label="WhatsApp" accent="#25D366">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {whatsappNumbers.map((number) => (
                  <a
                    key={number}
                    href={buildWhatsAppContactUrl(number, WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#25D366] transition hover:text-[#1da851] sm:text-base"
                  >
                    {formatDisplayPhone(number)}
                  </a>
                ))}
                <span className="rounded-full border border-[#C9A227]/50 bg-[#C9A227]/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#E8C547] sm:px-2.5 sm:text-[9px]">
                  Available 24/7
                </span>
              </div>
            </ContactRow>
          )}

          {phoneNumbers.length > 0 && (
            <ContactRow icon={Phone} label="Call Us" accent="#C9A227">
              {phoneNumbers.map((number) => (
                <a key={number} href={buildTelUrl(number)} className={linkClass}>
                  {formatDisplayPhone(number)}
                </a>
              ))}
            </ContactRow>
          )}

          {email && (
            <ContactRow icon={Mail} label="Email Us" accent="#C9A227">
              <a href={buildMailtoUrl(email)} className={cn(linkClass, 'break-all')}>
                {email}
              </a>
            </ContactRow>
          )}

          {address && (
            <ContactRow icon={MapPin} label="Visit Us" accent="#C9A227">
              {mapsUrl ? (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={bodyClass}>
                  {formatAddressInline(address)}
                </a>
              ) : (
                <p className={bodyClass}>{formatAddressInline(address)}</p>
              )}
            </ContactRow>
          )}

          <ContactRow icon={Clock} label="Open Hours" accent="#C9A227" className="border-b-0">
            <p className="text-xs font-semibold text-white/90 sm:text-sm">{hours}</p>
          </ContactRow>
        </div>
      </div>
    </div>
  )
}
