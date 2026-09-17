import { AnimateIn } from '@/components/customer/AnimateIn'
import { CircularBrandLogo } from '@/components/prime/CircularBrandLogo'
import { BRAND_PARTNERS } from '@/lib/brandPartners'
import { ABOUT_COLORS, ABOUT_IMAGES } from '@/lib/aboutTokens'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { ESTABLISHED_YEAR } from '@/lib/businessInfo'

function BrandCard({
  logoSrc,
  logoAlt,
  logoClassName,
  title,
  tagline,
  description,
}: {
  logoSrc: string
  logoAlt: string
  logoClassName: string
  title: string
  tagline?: string
  description: string
}) {
  return (
    <article
      className="relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-[#062B63]/10 text-center shadow-[0_6px_20px_rgba(6,43,99,0.08)] sm:rounded-2xl sm:shadow-[0_8px_28px_rgba(6,43,99,0.08)]"
    >
      <img
        src={ABOUT_IMAGES.brandCardBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-white/45" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center px-4 py-5 sm:px-6 sm:py-8">
        <CircularBrandLogo src={logoSrc} alt={logoAlt} className={logoClassName} />
        <h3 className="mt-3 font-display text-lg font-bold text-[#062B63] sm:mt-5 sm:text-xl">{title}</h3>
        {tagline ? (
          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8B7355] sm:mt-1 sm:text-[10px] sm:tracking-[0.2em]">
            {tagline}
          </p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-[#062B63]/75 sm:mt-3 sm:text-sm">{description}</p>
      </div>
    </article>
  )
}

export function AboutBrands() {
  return (
    <section
      className="relative z-10 overflow-hidden px-4 py-10 sm:px-6 sm:py-20"
      aria-labelledby="about-brands-heading"
    >
      <img
        src={ABOUT_IMAGES.brandsMobileBg}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-fill object-center md:hidden"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <img
        src={ABOUT_IMAGES.brandsBg}
        alt=""
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#E8C56A]">
              Our Brands
            </p>
            <h2
              id="about-brands-heading"
              className="mt-3 font-display text-[1.65rem] font-bold leading-tight text-white sm:mt-4 sm:text-[2.35rem]"
            >
              Part of{' '}
              <span style={{ color: ABOUT_COLORS.gold }}>Shanmugapriya Pyrotech</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-white/80 sm:mt-5 sm:text-[15px]">
              Established in {ESTABLISHED_YEAR}, Shanmugapriya Pyrotech carries forward Sivakasi&apos;s
              fireworks heritage through trusted brands loved by families across India.
            </p>
          </div>
        </AnimateIn>

        <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          <AnimateIn animation="fade-up" delay={60} duration={700}>
            <BrandCard
              logoSrc={SITE_LOGO_PATH}
              logoAlt={SHANMUGA_BRAND.displayName}
              logoClassName="h-16 w-16 border-2 border-[#062B63]/15 p-2 sm:h-24 sm:w-24 sm:p-3"
              title={SHANMUGA_BRAND.displayName}
              description="Our flagship brand for premium Sivakasi fireworks — wholesale, retail, and all-India delivery."
            />
          </AnimateIn>

          {BRAND_PARTNERS.map((brand, index) => (
            <AnimateIn key={brand.id} animation="fade-up" delay={120 + index * 60} duration={700}>
              <BrandCard
                logoSrc={brand.logo}
                logoAlt={`${brand.name} logo`}
                logoClassName="h-16 w-16 border-2 border-[#0077B6]/20 p-2 sm:h-24 sm:w-24 sm:p-3"
                title={brand.name}
                tagline={brand.tagline}
                description={brand.description}
              />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
