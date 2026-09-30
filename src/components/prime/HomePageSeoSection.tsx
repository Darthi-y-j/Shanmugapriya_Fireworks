import { Link } from 'react-router-dom'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { HomeSocialShare } from '@/components/prime/HomeSocialShare'
import { STORE_GOOGLE_MAPS_URL } from '@/lib/maps'

const INTERNAL_LINKS = [
  { to: '/products', label: 'Shop all Diwali crackers' },
  { to: '/about', label: 'About Shanmuga Priya Crackers' },
  { to: '/contact', label: 'Contact & store location' },
  { to: '/delivery', label: 'Delivery across India' },
  { to: '/safety', label: 'Fireworks safety guide' },
  { to: '/faq', label: 'Frequently asked questions' },
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of service' },
] as const

export function HomePageSeoSection() {
  return (
    <section
      className="border-t border-[#E8DFD0]/80 bg-[#F7F3EC] py-10 sm:py-14"
      aria-labelledby="home-seo-guide-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <AnimateIn animation="fade-up" duration={650}>
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
              <Link to="/safety" className="font-semibold text-[#0077B6] underline-offset-2 hover:underline">
                safety guide
              </Link>{' '}
              before lighting fireworks, and check{' '}
              <Link to="/delivery" className="font-semibold text-[#0077B6] underline-offset-2 hover:underline">
                delivery information
              </Link>{' '}
              for dispatch timelines and service areas.
            </p>
          </div>

          <nav className="mt-6" aria-label="Explore our website">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8B7355]">
              Explore the store
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {INTERNAL_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex rounded-full border border-[#C9A24A]/40 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#062B63] transition hover:border-[#0077B6]/50 hover:text-[#0077B6] sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <HomeSocialShare className="mt-8" />
        </AnimateIn>
      </div>
    </section>
  )
}
