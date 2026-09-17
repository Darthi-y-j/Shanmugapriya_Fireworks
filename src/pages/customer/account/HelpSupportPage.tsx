import { Link } from 'react-router-dom'
import {
  MessageCircle,
  HelpCircle,
  Truck,
  FileText,
  Shield,
  ExternalLink,
  Sparkles,
  Phone,
  ArrowRight,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AccountPageHeader, MenuLink, MenuSection, QuickActionCard, accountContentClass } from '@/components/customer/account/AccountUI'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers, formatDisplayPhone } from '@/lib/businessInfo'

export function HelpSupportPage() {
  const { settings } = useSettings()
  const whatsappNumbers = getWhatsAppNumbers(settings)
  const whatsappUrl = whatsappNumbers[0]
    ? buildWhatsAppUrl(whatsappNumbers[0], 'Hi Shanmuga Priya Crackers, I need help with my enquiry.')
    : '/contact'

  return (
    <>
      <SEO title="Help & Support" description="Get help with enquiries, delivery, and your account." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Help & Support" />

      <div className={`${accountContentClass} space-y-6`}>
        {/* WhatsApp CTA banner */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-[#25D366]/30 bg-gradient-to-r from-[#25D366] to-[#128C7E] p-5 text-white shadow-lg transition hover:shadow-xl"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
            <MessageCircle className="h-7 w-7" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
              Fastest support
            </span>
            <span className="block font-display text-lg font-extrabold">Chat on WhatsApp</span>
            <span className="mt-0.5 block text-sm text-white/85">
              Quotes, bulk orders & delivery — {settings.phone ? formatDisplayPhone(settings.phone) : '24/7'}
            </span>
          </span>
          <ExternalLink className="h-5 w-5 shrink-0 opacity-70 transition group-hover:opacity-100" />
        </a>

        <div>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F2847]/55">
            <Sparkles className="h-3.5 w-3.5 text-[#0077B6]" />
            Quick help
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <QuickActionCard
              to="/faq"
              label="FAQ"
              description="Common questions"
              accent="#1A3D66"
              icon={<HelpCircle className="h-5 w-5 text-[#1A3D66]" />}
            />
            <QuickActionCard
              to="/contact"
              label="Contact"
              description="Phone & email"
              accent="#0F2847"
              icon={<Phone className="h-5 w-5 text-[#0F2847]" />}
            />
            <QuickActionCard
              to="/delivery"
              label="Delivery"
              description="All over India"
              accent="#0077B6"
              icon={<Truck className="h-5 w-5 text-[#0077B6]" />}
            />
          </div>
        </div>

        <MenuSection title="Policies & information">
          <MenuLink
            to="/delivery"
            icon={<Truck className="h-5 w-5 text-[#0F2847]" />}
            label="Delivery Information"
            description="How ordering & delivery works"
          />
          <MenuLink
            to="/terms"
            icon={<FileText className="h-5 w-5 text-[#0F2847]" />}
            label="Terms & Conditions"
            description="Ordering and website terms"
          />
          <MenuLink
            to="/safety"
            icon={<Shield className="h-5 w-5 text-[#0077B6]" />}
            label="Safety Guidelines"
            description="Responsible fireworks use"
            accent="#0077B6"
          />
          <MenuLink
            to="/privacy"
            icon={<Shield className="h-5 w-5 text-[#1A3D66]" />}
            label="Privacy Policy"
            description="How we handle your data"
            accent="#1A3D66"
          />
        </MenuSection>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#0F2847]/15 bg-white py-3.5 text-sm font-bold text-[#0F2847] shadow-sm transition hover:border-[#0077B6]/50 hover:bg-[#FFF8E1]/50"
        >
          Continue shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  )
}
