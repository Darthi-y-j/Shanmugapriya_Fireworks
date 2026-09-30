import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { MapPin, Package, ShieldCheck, ShoppingBag, Sparkles, Store } from 'lucide-react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'
import { absoluteInternalPath, HOME_SEO_NAV_LINKS } from '@/lib/seoInternalLinks'

const guideCardShellClass =
  'relative overflow-hidden rounded-2xl border border-[#C9A24A]/40 shadow-[0_8px_30px_rgba(0,0,0,0.18)]'

function GuideCardShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`${guideCardShellClass} ${className ?? ''}`}>
      <OptimizedBackground src={ABOUT_IMAGES.brandCardBg} priority={false} />
      <div className="absolute inset-0 bg-white/20" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function GuideTopicCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
}) {
  return (
    <GuideCardShell className="h-full">
      <div className="flex items-start gap-3 p-5 sm:p-6">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#062B63] to-[#0F4C8A] text-[#E8C56A] shadow-md"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-[#062B63] sm:text-lg">{title}</h3>
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-[#062B63]/85 sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </GuideCardShell>
  )
}

const linkClass = 'font-semibold text-[#0077B6] underline-offset-2 hover:underline'

export function HomePageSeoSection() {
  return (
    <section
      className="relative overflow-hidden border-t border-[#C9A24A]/30 py-12 pb-8 sm:py-16 sm:pb-10"
      aria-labelledby="home-seo-guide-heading"
    >
      <OptimizedBackground
        src={ABOUT_IMAGES.brandsMobileBg}
        fit="fill"
        priority={false}
        className="bg-[#041E47] md:hidden"
      />
      <OptimizedBackground
        src={ABOUT_IMAGES.brandsBg}
        priority={false}
        className="hidden bg-[#041E47] md:block"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[#041E47]/30"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E8C56A]">
            <Sparkles className="h-4 w-4 text-[#E8C56A]" aria-hidden="true" />
            Festival shopping guide
          </p>
          <h2
            id="home-seo-guide-heading"
            className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl"
          >
            Sivakasi Diwali crackers — wholesale &amp; retail
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-[#C9A24A] to-transparent" />
        </header>

        <GuideCardShell className="mt-8 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
          <div className="p-5 sm:p-7 lg:px-8">
          <p className="text-sm leading-relaxed text-[#062B63]/90 sm:text-base">
            <strong>Shanmuga Priya Crackers</strong> supplies licensed fireworks from Sivakasi for
            families, retailers, and event planners. Browse sparklers, flower pots, rockets, ground
            chakras, gift boxes, aerial shells, and premium sky shots with clear pricing and WhatsApp
            enquiry for every order.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#062B63]/85 sm:text-base">
            We focus on quality-checked stock, tamper-proof packaging, and dependable dispatch during
            the festival season — for Diwali, weddings, temple festivals, and celebrations across Tamil
            Nadu and all-India delivery.
          </p>
          </div>
        </GuideCardShell>

        <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 xl:gap-6">
          <GuideTopicCard icon={Package} title="Popular cracker categories in our shop">
            <p>
              Sparklers and fountains suit family gatherings. Flower pots, chakras, and ground spinners
              add colour at street level. Rockets, missiles, and multi-shot cakes suit larger displays.
              Gift boxes make Diwali gifting simple.
            </p>
            <p>
              Use the{' '}
              <a href={absoluteInternalPath('/products')} className={linkClass}>shop fireworks</a> page to
              filter by category and send one WhatsApp message with your full requirement.
            </p>
          </GuideTopicCard>

          <GuideTopicCard icon={ShoppingBag} title="How to order on our website">
            <p>
              Browse the catalogue and add products to your{' '}
              <a href={absoluteInternalPath('/cart')} className={linkClass}>shopping cart</a>. Review pack
              sizes, then send your cart on WhatsApp for confirmation, payment details, and dispatch
              updates.
            </p>
            <p>
              Read{' '}
              <a href={absoluteInternalPath('/why-no-online-payment')} className={linkClass}>
                why we use WhatsApp confirmation
              </a>{' '}
              and our <a href={absoluteInternalPath('/faq')} className={linkClass}>FAQ</a> for common
              questions.
            </p>
          </GuideTopicCard>

          <GuideTopicCard icon={Store} title="Wholesale, dealers &amp; bulk">
            <p>
              Share quantities, delivery location, and product mix on{' '}
              <a href={absoluteInternalPath('/contact')} className={linkClass}>contact</a> or WhatsApp.
              We help balance budget assortments with display-friendly gift packs for retail counters.
            </p>
            <p>
              Learn about our heritage on the{' '}
              <a href={absoluteInternalPath('/about')} className={linkClass}>about page</a>.
            </p>
          </GuideTopicCard>

          <GuideTopicCard icon={MapPin} title="Visit our shop in Pattampudur">
            <p>
              Visit our store in Virudhunagar district, in the heart of the Sivakasi fireworks trade.{' '}
              <a href={STORE_GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Open Google Maps
              </a>{' '}
              for directions and hours. Many customers visit in person and re-order on WhatsApp later.
            </p>
          </GuideTopicCard>
        </div>

        <div className="mt-5">
        <GuideTopicCard icon={ShieldCheck} title="Safety, delivery &amp; responsible celebration">
          <p>
            Adults should store, handle, and light fireworks in open areas away from buildings. Read our{' '}
            <a href={absoluteInternalPath('/safety')} className={linkClass}>safety guide</a> and official{' '}
            <a
              href="https://peso.gov.in/web/en/fireworks"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              PESO guidance
            </a>
            . See <a href={absoluteInternalPath('/delivery')} className={linkClass}>delivery information</a>{' '}
            for service areas and packing.
          </p>
          <p>
            Save items to your{' '}
            <a href={absoluteInternalPath('/wishlist')} className={linkClass}>wishlist</a>, use{' '}
            <a href={absoluteInternalPath('/login')} className={linkClass}>customer login</a> to track
            enquiries, and review our{' '}
            <a href={absoluteInternalPath('/privacy')} className={linkClass}>privacy</a> and{' '}
            <a href={absoluteInternalPath('/terms')} className={linkClass}>terms</a>.
          </p>
        </GuideTopicCard>
        </div>

        <GuideCardShell className="mt-8">
          <nav className="px-4 py-5 sm:px-6" aria-label="Explore our website">
            <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[#8B7355]">
              Quick links
            </p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {HOME_SEO_NAV_LINKS.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a
                    href={item.href}
                    className="inline-flex rounded-full border border-[#C9A24A]/40 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#062B63] transition hover:border-[#0077B6]/50 hover:bg-white hover:text-[#0077B6] sm:text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </GuideCardShell>
      </div>
    </section>
  )
}
