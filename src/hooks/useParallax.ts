import { useEffect, useRef, useState } from 'react'

type UseParallaxOptions = {
  /** Multiplier — higher = more movement (0.35–0.55 matches fixed-bg feel) */
  speed?: number
}

/**
 * Scroll-linked offset that mimics `background-attachment: fixed`:
 * the layer shifts opposite to scroll as the section crosses the viewport.
 */
export function useParallax({ speed = 0.45 }: UseParallaxOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [useFixed, setUseFixed] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const fixedSupported = !reducedMotion && !coarsePointer && !narrow

    setUseFixed(fixedSupported)
    if (reducedMotion) return

    if (fixedSupported) return

    let frame = 0

    const update = () => {
      const rect = container.getBoundingClientRect()
      const viewH = window.innerHeight
      const sectionCenter = rect.top + rect.height / 2
      const viewportCenter = viewH / 2
      const next = (sectionCenter - viewportCenter) * -speed
      setOffset(next)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed])

  return { containerRef, offset, useFixed }
}
