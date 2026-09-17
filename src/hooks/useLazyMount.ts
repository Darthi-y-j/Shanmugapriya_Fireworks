import { useEffect, useRef, useState } from 'react'

/** Mount children only after the element nears the viewport (reduces initial DOM work). */
export function useLazyMount(rootMargin = '320px 0px') {
  const ref = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (mounted) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [mounted, rootMargin])

  return { ref, mounted }
}
