import { useEffect, useRef, type RefObject } from 'react'

const PARALLAX_SPEED = 0.45

type SkewedParallaxRefs = {
  wrapperRef: RefObject<HTMLDivElement | null>
  bgRef: RefObject<HTMLDivElement | null>
}

/**
 * Scroll + optional mouse parallax for skewed hero band (matches parallax_efferctdemo.html).
 * Updates transform via refs — no React state on scroll.
 */
export function useSkewedParallax({ wrapperRef, bgRef }: SkewedParallaxRefs) {
  const mouseRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 })
  const reducedRef = useRef(false)
  const rafScrollRef = useRef(0)
  const mouseEnabledRef = useRef(true)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const bg = bgRef.current
    if (!wrapper || !bg) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = mq.matches
    mouseEnabledRef.current = !mq.matches && window.innerWidth >= 1024

    const getSpeed = () => {
      const w = window.innerWidth
      if (w < 640) return PARALLAX_SPEED * 0.25
      if (w < 1024) return PARALLAX_SPEED * 0.55
      return PARALLAX_SPEED
    }

    const updateScroll = () => {
      rafScrollRef.current = 0
      if (reducedRef.current) {
        bg.style.transform = 'scale(1.08)'
        return
      }

      const rect = wrapper.getBoundingClientRect()
      const vh = window.innerHeight
      const relativeY = rect.top - vh / 2 + rect.height / 2
      const offset = relativeY * getSpeed() * -1
      const { currentX, currentY } = mouseRef.current

      bg.style.transform = `translateY(${offset}px) scale(1.08) translate3d(${currentX}px, ${currentY}px, 0)`
    }

    const onScroll = () => {
      if (!rafScrollRef.current) {
        rafScrollRef.current = requestAnimationFrame(updateScroll)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!mouseEnabledRef.current) return
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseRef.current.targetX = (e.clientX - centerX) * 0.03
      mouseRef.current.targetY = (e.clientY - centerY) * 0.03
    }

    let mouseRaf = 0
    const tickMouse = () => {
      mouseRaf = requestAnimationFrame(tickMouse)
      if (!mouseEnabledRef.current || reducedRef.current) return

      const m = mouseRef.current
      m.currentX += (m.targetX - m.currentX) * 0.08
      m.currentY += (m.targetY - m.currentY) * 0.08

      if (!rafScrollRef.current) {
        rafScrollRef.current = requestAnimationFrame(updateScroll)
      }
    }

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches
      mouseEnabledRef.current = !e.matches && window.innerWidth >= 1024
      updateScroll()
    }

    mq.addEventListener('change', onMotionChange)
    updateScroll()
    mouseRaf = requestAnimationFrame(tickMouse)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafScrollRef.current)
      cancelAnimationFrame(mouseRaf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      mq.removeEventListener('change', onMotionChange)
    }
  }, [wrapperRef, bgRef])

}
