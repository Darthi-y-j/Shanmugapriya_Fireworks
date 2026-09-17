import { useEffect, useRef, useState } from 'react'

/** Pause CSS animations on descendants when the element leaves the viewport. */
export function usePauseWhenHidden<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPaused(!entry.isIntersecting)
      },
      { threshold: 0.05, rootMargin: '80px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, paused }
}
