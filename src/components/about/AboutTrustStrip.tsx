import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Box, Globe, Smile, Users } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { useCountUp } from '@/hooks/useCountUp'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { getYearsInBusiness } from '@/lib/businessInfo'

const STATS = [
  { icon: Users, value: `${getYearsInBusiness()}+`, label: 'Years of Trust' },
  { icon: Box, value: '500+', label: 'Products Range' },
  { icon: Smile, value: '1M+', label: 'Happy Customers' },
  { icon: Globe, value: 'All Over', label: 'India' },
] as const

function TrustStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const display = useCountUp(value, visible)

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col items-center justify-center px-2.5 py-4 text-center sm:px-5 sm:py-9"
    >
      <img
        src={ABOUT_IMAGES.trustCardBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10">
        <div
          className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#E8C56A]/45 bg-[#E8C56A]/12 sm:mb-4 sm:h-12 sm:w-12"
          aria-hidden="true"
        >
          <Icon className="h-3.5 w-3.5 text-[#E8C56A] sm:h-5 sm:w-5" strokeWidth={1.5} />
        </div>
        <p className="font-display text-2xl font-bold leading-none text-white sm:text-4xl">
          {display}
        </p>
        <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#E8C56A] sm:mt-2.5 sm:text-[11px] sm:tracking-[0.22em]">
          {label}
        </p>
      </div>
    </div>
  )
}

export function AboutTrustStrip() {
  return (
    <section className="relative z-10 overflow-hidden py-6 sm:py-12" aria-label="Company statistics">
      <img
        src={`${ABOUT_IMAGES.rangoliBg}?v=2`}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <AnimateIn animation="fade-up" duration={700}>
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="overflow-hidden rounded-xl border border-[#062B63]/8 shadow-[0_6px_20px_rgba(6,43,99,0.07)] sm:rounded-2xl sm:shadow-[0_8px_28px_rgba(6,43,99,0.07)]"
              >
                <TrustStat {...stat} />
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
