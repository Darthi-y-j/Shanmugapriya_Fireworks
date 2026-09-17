import { Link } from 'react-router-dom'
import { ShieldAlert, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { DosAndDontsSection } from '@/components/customer/DosAndDontsSection'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'

import { PageHeader } from '@/components/customer/PageHeader'
import { FestivePageBackground } from '@/components/customer/FestivePageBackground'

const safetyChips = ['Outdoor Only', 'Adult Supervision', 'Licensed Products', 'Emergency Ready']

export function SafetyPage() {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="Safety Guidelines"
        description="Fireworks dos and don'ts — celebrate safely with Shanmuga Priya Crackers' responsible usage guide."
        url="/safety"
      />

      <FestivePageBackground>
        <PageHeader contentClassName="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-white/70">
              <Link to="/" className="transition hover:text-[#0077B6]">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-white">Safety</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/35 bg-[#0077B6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Safety Guide
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
                  Fireworks <span className="text-[#0077B6]">Dos & Don'ts</span>
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                  Celebrate responsibly with these essential guidelines for a safe and joyful experience with Shanmuga Priya Crackers.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {safetyChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
        </PageHeader>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DosAndDontsSection compact showHeader={false} />

            <AnimateIn animation="fade-up" delay={280}>
              <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#0F2847]/15 bg-gradient-to-r from-[#0F2847] to-[#1A3D66] shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-[#0077B6] sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-extrabold uppercase text-white sm:text-2xl">
                      Need safety advice?
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                      Our team can guide you on product handling, storage, and safe usage before your celebration.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, 'Hello! I need safety guidance for fireworks.')}
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
      </FestivePageBackground>
    </>
  )
}
