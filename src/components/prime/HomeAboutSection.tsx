import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Truck } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { HomeAboutParallaxHero } from '@/components/prime/HomeAboutParallaxHero'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { HOME_IMAGES } from '@/lib/homeImages'
import { optimizedBackgroundStyle } from '@/lib/optimizedAssets'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { useSettings } from '@/contexts/SettingsContext'

const BLUE_DARK = SHANMUGA_BRAND.primary
const RANGOLI_BG = `${ABOUT_IMAGES.rangoliBg}?v=2`
const ABOUT_MOBILE_BG = HOME_IMAGES.aboutMobileBg

const HIGHLIGHTS = [
  { icon: MapPin, label: 'Sivakasi Origin', desc: "Heart of India's fireworks" },
  { icon: Shield, label: 'Licensed & Safe', desc: 'Quality-checked products' },
  { icon: Truck, label: 'All-India Delivery', desc: 'Festival-ready dispatch' },
] as const

export function HomeAboutSection() {
  const { settings } = useSettings()

  const paragraph2 =
    settings.about_text?.split('\n').slice(1).join(' ').trim() ||
    'With years of experience, we combine tradition with safety — offering licensed products, tamper-proof packaging, and reliable festival-season delivery for wholesale and retail customers.'

  return (
    <div className="relative" aria-labelledby="home-about-highlights">
      <HomeAboutParallaxHero />

      {/* Bottom content — sits under slanted parallax overlap */}
      <div className="relative z-10 px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <div
          className="pointer-events-none absolute inset-0 bg-white md:hidden"
          style={optimizedBackgroundStyle(ABOUT_MOBILE_BG, {
            size: '100% 100%',
            position: 'center',
          })}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={optimizedBackgroundStyle(RANGOLI_BG, {
            size: '100% 100%',
            position: 'center',
          })}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-1 sm:px-0">
          <AnimateIn animation="fade-up" delay={120} duration={750}>
            <p
              id="home-about-highlights"
              className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-[#062B63]/75 sm:text-base md:text-slate-600"
            >
              {paragraph2}
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={200} duration={750}>
            <ul className="mx-auto mt-5 flex max-w-5xl flex-col gap-2 sm:mt-10 sm:flex-row sm:gap-0 sm:overflow-hidden sm:rounded-[1.75rem] sm:border sm:border-[#C9A24A]/20 sm:bg-gradient-to-br sm:from-[#0F2847]/88 sm:via-[#0a1f38]/92 sm:to-[#061528]/95 sm:shadow-[0_16px_48px_rgba(6,21,40,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] sm:backdrop-blur-xl">
              {HIGHLIGHTS.map(({ icon: Icon, label, desc }, index) => (
                <li
                  key={label}
                  className="group relative flex flex-1 flex-row items-center gap-2 rounded-lg border border-[#C9A24A]/15 bg-gradient-to-br from-[#0F2847]/88 via-[#0a1f38]/92 to-[#061528]/95 px-2.5 py-2 text-left shadow-[0_4px_16px_rgba(6,21,40,0.22)] backdrop-blur-xl transition duration-300 hover:border-[#C9A24A]/30 sm:flex-col sm:items-center sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-6 sm:py-8 sm:text-center sm:shadow-none sm:backdrop-blur-none sm:hover:bg-white/[0.04] sm:hover:shadow-[0_14px_40px_rgba(6,21,40,0.5)]"
                >
                  {index > 0 && (
                    <span
                      className="pointer-events-none absolute bottom-7 left-0 top-7 hidden w-px bg-gradient-to-b from-transparent via-[#C9A24A]/35 to-transparent sm:block"
                      aria-hidden="true"
                    />
                  )}

                  <div
                    className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#1a3d6b] to-[#0F2847] shadow-[0_4px_12px_rgba(0,0,0,0.25)] ring-1 ring-[#C9A24A]/50 ring-offset-1 ring-offset-[#0a1f38] transition duration-300 group-hover:scale-110 group-hover:ring-[#E8C56A]/75 sm:h-12 sm:w-12 sm:rounded-xl sm:ring-2 sm:ring-offset-2"
                    aria-hidden="true"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#F0D78C] sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </div>

                  <div className="relative min-w-0 flex-1 sm:flex-none">
                    <p className="font-display text-[11px] font-bold leading-tight text-white sm:text-base">{label}</p>
                    <p className="mt-0.5 text-[9px] leading-snug text-white/70 sm:mt-1.5 sm:text-xs sm:leading-relaxed">{desc}</p>
                  </div>

                  <span
                    className="mt-auto hidden h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent via-[#C9A24A] to-transparent opacity-60 transition duration-300 group-hover:w-16 group-hover:opacity-100 sm:block"
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={280} duration={750}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                style={{ backgroundColor: BLUE_DARK }}
              >
                Know More About Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="font-script text-xl text-[#0F2847]/45 sm:text-2xl">
                {SHANMUGA_BRAND.tagline}
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}
