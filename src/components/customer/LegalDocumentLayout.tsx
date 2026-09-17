import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Shield,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Check,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

import { LEGAL_PAGE_HERO_BG } from '@/lib/siteConfig'
import { underNavPullClass, underNavTopPadClass } from '@/lib/underNavLayout'

export interface LegalSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
  afterBullets?: string[]
}

interface LegalDocumentLayoutProps {
  title: string
  seoDescription: string
  url: string
  effectiveDate: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
  closingNote?: string
  heroChips?: string[]
  relatedPage?: { label: string; href: string }
}

function sectionSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function sectionNumber(title: string) {
  const match = title.match(/^(\d+)\./)
  return match ? match[1].padStart(2, '0') : '•'
}

function sectionLabel(title: string) {
  return title.replace(/^\d+\.\s*/, '')
}

function LegalSectionCard({ section }: { section: LegalSection }) {
  const slug = sectionSlug(section.title)

  return (
    <article
      id={slug}
      className="scroll-mt-28 rounded-2xl border border-[#0F2847]/10 bg-white p-5 shadow-sm transition hover:border-[#0077B6]/45 hover:shadow-md sm:p-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0077B6] font-display text-sm font-extrabold text-[#0F2847] sm:h-11 sm:w-11">
          {sectionNumber(section.title)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-[#0F2847] sm:text-xl">
            {sectionLabel(section.title)}
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#0F2847]/80">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="whitespace-pre-line">{paragraph}</p>
            ))}
          </div>

          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 space-y-2.5">
              {section.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#0F2847]/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F2847]/10">
                    <Check className="h-3 w-3 text-[#0F2847]" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {section.afterBullets && section.afterBullets.length > 0 && (
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#0F2847]/80">
              {section.afterBullets.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export function LegalDocumentLayout({
  title,
  seoDescription,
  url,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
  closingNote,
  heroChips = [],
  relatedPage,
}: LegalDocumentLayoutProps) {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]
  const [activeSlug, setActiveSlug] = useState(sectionSlug(sections[0]?.title ?? ''))

  useEffect(() => {
    const slugs = sections.map((s) => sectionSlug(s.title))
    const elements = slugs.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) setActiveSlug(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <>
      <SEO title={title} description={seoDescription} url={url} />

      <div className={cn('bg-[#F7F3EC]', underNavPullClass)}>
        <header className="relative min-h-[280px] overflow-hidden border-b-2 border-[#0F2847] sm:min-h-[320px]">
          <img
            src={LEGAL_PAGE_HERO_BG}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_35%]"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0F2847]/55 via-[#0F2847]/30 to-[#0F2847]/65"
            aria-hidden="true"
          />
          <div
            className={cn(
              'relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8',
              underNavTopPadClass,
            )}
          >
            <nav className="flex items-center gap-2 text-xs text-white/70">
              <Link to="/" className="transition hover:text-[#0077B6]">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-white">{title}</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/35 bg-[#0077B6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077B6]">
                  <FileText className="h-3.5 w-3.5" />
                  Legal
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">{intro}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    Effective {effectiveDate}
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                    Updated {lastUpdated}
                  </span>
                  {relatedPage && (
                    <Link
                      to={relatedPage.href}
                      className="inline-flex items-center gap-1 rounded-full border border-[#0077B6]/40 bg-[#0077B6]/15 px-3 py-1.5 text-xs font-bold text-[#0077B6] transition hover:bg-[#0077B6]/25"
                    >
                      {relatedPage.label}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {heroChips.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {heroChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AnimateIn>
          </div>
        </header>

        <section className="bg-[#F7F3EC] py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] xl:gap-10">
              <aside className="mb-6 lg:mb-0">
                <div className="lg:sticky lg:top-24">
                    <div className="overflow-hidden rounded-2xl border border-[#0F2847]/10 bg-white shadow-sm">
                      <div className="border-b border-[#0077B6]/25 bg-[#FFF8E1]/50 px-4 py-3">
                        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F2847]">
                          <Shield className="h-3.5 w-3.5 text-[#0077B6]" />
                          On this page
                        </p>
                      </div>
                      <nav className="max-h-[min(70vh,32rem)] overflow-y-auto p-2" aria-label="Table of contents">
                        <ul className="space-y-0.5">
                          {sections.map((section) => {
                            const slug = sectionSlug(section.title)
                            const isActive = activeSlug === slug
                            return (
                              <li key={section.title}>
                                <a
                                  href={`#${slug}`}
                                  onClick={() => setActiveSlug(slug)}
                                  className={cn(
                                    'flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition sm:text-[0.8125rem]',
                                    isActive
                                      ? 'bg-[#0077B6]/15 font-bold text-[#0F2847]'
                                      : 'text-[#0F2847]/65 hover:bg-[#FFF8E1]/60 hover:text-[#0F2847]',
                                  )}
                                >
                                  <span
                                    className={cn(
                                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-display text-[10px] font-bold',
                                      isActive ? 'bg-[#0077B6] text-[#0F2847]' : 'bg-[#0F2847]/8 text-[#0F2847]/60',
                                    )}
                                  >
                                    {sectionNumber(section.title)}
                                  </span>
                                  <span className="line-clamp-2 leading-snug">{sectionLabel(section.title)}</span>
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      </nav>
                    </div>
                </div>
              </aside>

              <div className="min-w-0 space-y-4 sm:space-y-5">
                {sections.map((section) => (
                  <LegalSectionCard key={section.title} section={section} />
                ))}

                {closingNote && (
                    <div className="rounded-2xl border border-[#0077B6]/35 bg-[#FFF8E1]/60 p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F2847]/10">
                          <Shield className="h-5 w-5 text-[#0F2847]" />
                        </span>
                        <p className="text-sm leading-relaxed text-[#0F2847]/85">{closingNote}</p>
                      </div>
                    </div>
                )}
              </div>
            </div>

              <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#0F2847]/15 bg-gradient-to-r from-[#0F2847] to-[#1A3D66] shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-[#0077B6] sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-extrabold uppercase text-white sm:text-2xl">
                      Questions about this document?
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                      Reach out anytime — our team is available on WhatsApp 24/7.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, `Hello! I have a question about your ${title}.`)}
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        </section>
      </div>
    </>
  )
}
