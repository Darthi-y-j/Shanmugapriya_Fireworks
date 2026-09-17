import type { ReactNode, RefObject } from 'react'
import { useLazyMount } from '@/hooks/useLazyMount'

interface LazySectionProps {
  children: ReactNode
  className?: string
  /** Placeholder height while waiting to enter the viewport */
  minHeight?: string
  rootMargin?: string
}

/** Renders children only when the section is near the viewport. */
export function LazySection({
  children,
  className,
  minHeight = '1px',
  rootMargin = '280px 0px',
}: LazySectionProps) {
  const { ref, mounted } = useLazyMount(rootMargin)

  return (
    <div ref={ref as RefObject<HTMLDivElement>} className={className} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  )
}
