import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '@/hooks/useCountUp'
import { ABOUT_COLORS } from '@/lib/aboutTokens'

type StatItemProps = {
  icon: LucideIcon
  value: string
  label: string
}

export function StatItem({ icon: Icon, value, label }: StatItemProps) {
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
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const display = useCountUp(value, visible)

  return (
    <div ref={ref} className="flex flex-1 items-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: `${ABOUT_COLORS.royal}40`, color: ABOUT_COLORS.royal }}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-display text-2xl font-bold leading-none text-[#062B63] sm:text-3xl">
          {display}
        </p>
        <p className="mt-1.5 text-xs font-medium leading-snug text-slate-500 sm:text-sm">{label}</p>
      </div>
    </div>
  )
}
