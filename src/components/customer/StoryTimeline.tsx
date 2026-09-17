import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface StoryTimelineItem {
  year: string
  title: string
  text: string
  note: string
}

interface StoryTimelineProps {
  items: StoryTimelineItem[]
}

export function StoryTimeline({ items }: StoryTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(() => new Set())
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    if (prefersReduced) {
      setSectionVisible(true)
      setVisibleSteps(new Set(items.map((_, i) => i)))
    }
  }, [items])

  useEffect(() => {
    if (reducedMotion) return

    const container = containerRef.current
    if (!container) return

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true)
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )
    sectionObserver.observe(container)

    const stepElements = container.querySelectorAll<HTMLElement>('[data-story-step]')
    const stepObserver = new IntersectionObserver(
      (entries) => {
        setVisibleSteps((prev) => {
          const next = new Set(prev)
          for (const entry of entries) {
            const index = Number(entry.target.getAttribute('data-story-step'))
            if (entry.isIntersecting) next.add(index)
          }
          return next
        })
      },
      { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' },
    )

    stepElements.forEach((el) => stepObserver.observe(el))

    return () => {
      sectionObserver.disconnect()
      stepObserver.disconnect()
    }
  }, [items, reducedMotion])

  const maxVisibleIndex =
    visibleSteps.size > 0 ? Math.max(...visibleSteps) : sectionVisible ? 0 : -1
  const lineHeight =
    maxVisibleIndex < 0
      ? '0%'
      : `${Math.min(100, ((maxVisibleIndex + 0.55) / items.length) * 100)}%`

  return (
    <div ref={containerRef} className="relative mx-auto mt-12 max-w-3xl sm:mt-14">
      <div
        className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 sm:left-[23px]"
        aria-hidden="true"
      />

      <div
        className={cn(
          'absolute left-[19px] top-0 w-px bg-gradient-to-b from-festive-500 via-gold-400 to-gold-400/30 sm:left-[23px]',
          reducedMotion ? '' : 'transition-[height] duration-700 ease-out',
        )}
        style={{ height: sectionVisible || reducedMotion ? lineHeight : '0%' }}
        aria-hidden="true"
      />

      <div className="space-y-10 sm:space-y-14">
        {items.map((item, index) => {
          const isVisible = visibleSteps.has(index) || reducedMotion
          const stepDelay = index * 120

          return (
            <article
              key={item.year}
              data-story-step={index}
              className="relative pl-12 sm:pl-16"
            >
              <span
                className={cn(
                  'absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-navy-950 font-display text-sm font-bold sm:h-12 sm:w-12 sm:text-base',
                  isVisible
                    ? 'animate-timeline-node border-gold-400 text-gold-300 shadow-[0_0_0_4px_rgba(251,191,36,0.2),0_0_20px_rgba(245,158,11,0.15)]'
                    : 'scale-75 border-white/10 text-white/20 opacity-0',
                )}
                style={{ animationDelay: reducedMotion ? '0ms' : `${stepDelay}ms` }}
              >
                {item.year}
              </span>

              <div
                className={cn(
                  reducedMotion
                    ? 'opacity-100'
                    : 'transition-[opacity,transform] duration-700 ease-out',
                  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
                )}
                style={{ transitionDelay: reducedMotion ? '0ms' : `${stepDelay + 160}ms` }}
              >
                <h3 className="font-display text-xl font-bold text-cream-50 sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-100/70 sm:text-base">
                  {item.text}
                </p>
                <p
                  className={cn(
                    'mt-3 inline-flex rounded-full border border-gold-400/20 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-300',
                    reducedMotion
                      ? 'opacity-100'
                      : 'transition-all duration-500 ease-out',
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                  style={{ transitionDelay: reducedMotion ? '0ms' : `${stepDelay + 300}ms` }}
                >
                  {item.note}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
