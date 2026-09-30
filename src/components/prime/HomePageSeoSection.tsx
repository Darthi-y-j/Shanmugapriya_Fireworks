import { HomeSocialShare } from '@/components/prime/HomeSocialShare'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'
import { absoluteInternalPath, HOME_SEO_NAV_LINKS } from '@/lib/seoInternalLinks'

export function HomePageSeoSection() {
  return (
    <section
      className="border-t border-[#E8DFD0]/80 bg-[#F7F3EC] py-10 sm:py-14"
      aria-labelledby="home-seo-guide-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div>
          <h2
            id="home-seo-guide-heading"
            className="font-display text-lg font-bold text-[#062B63] sm:text-xl"
          >
            Sivakasi Diwali crackers — wholesale &amp; retail
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#062B63]/80 sm:text-base">
            <p>
              <strong>Shanmuga Priya Crackers</strong> supplies licensed fireworks from Sivakasi for
              families, retailers, and event planners. Browse our online catalogue for sparklers, flower
              pots, rockets, chakras, gift boxes, and premium sky shots — with clear pricing and simple
              WhatsApp enquiry for every order.
            </p>
            <p>
              We focus on quality-checked stock, tamper-proof packaging, and dependable dispatch during
              the festival season. Whether you need a small retail order or bulk wholesale quantities,
              our team helps you choose the right mix for Diwali, weddings, and community celebrations
              across Tamil Nadu and all-India delivery.
            </p>
            <p>
              Our online shop lists crackers and fireworks by category so you can compare prices, add
              favourites to your cart, and send a single WhatsApp enquiry for confirmation. Retail
              customers, dealers, and event organisers use the same catalogue for transparent pricing
              and fast responses during peak season.
            </p>
            <p>
              Shanmuga Priya Crackers is rooted in Sivakasi&apos;s licensed manufacturing ecosystem. We
              work with trusted makers, follow safety norms, and ship orders with care. For wholesale
              rates, bulk packing, or help choosing gift boxes and display assortments, visit our{' '}
              <a
                href={absoluteInternalPath('/contact')}
                className="font-semibold text-[#0077B6] underline-offset-2 hover:underline"
              >
                contact page
              </a>{' '}
              or browse the{' '}
              <a
                href={absoluteInternalPath('/products')}
                className="font-semibold text-[#0077B6] underline-offset-2 hover:underline"
              >
                full product list
              </a>
              .
            </p>
            <p>
              Visit our shop in Pattampudur (Virudhunagar district) or{' '}
              <a
                href={STORE_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#0077B6] underline-offset-2 hover:underline"
              >
                find us on Google Maps
              </a>
              . Read the{' '}
              <a
                href={absoluteInternalPath('/safety')}
                className="font-semibold text-[#0077B6] underline-offset-2 hover:underline"
              >
                safety guide
              </a>{' '}
              before lighting fireworks, and check{' '}
              <a
                href={absoluteInternalPath('/delivery')}
                className="font-semibold text-[#0077B6] underline-offset-2 hover:underline"
              >
                delivery information
              </a>{' '}
              for dispatch timelines and service areas.
            </p>
          </div>

          <nav className="mt-6" aria-label="Explore our website">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8B7355]">
              Explore the store
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {HOME_SEO_NAV_LINKS.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a
                    href={item.href}
                    className="inline-flex rounded-full border border-[#C9A24A]/40 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#062B63] transition hover:border-[#0077B6]/50 hover:text-[#0077B6] sm:text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <HomeSocialShare className="mt-8" />
        </div>
      </div>
    </section>
  )
}
