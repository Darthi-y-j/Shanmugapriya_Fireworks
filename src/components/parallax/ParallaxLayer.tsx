import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useParallaxContext, type ParallaxLayerConfig } from '@/components/parallax/parallaxContext'

type ParallaxLayerProps = ParallaxLayerConfig & {
  children: ReactNode
  className?: string
  style?: CSSProperties
  zIndex?: number
}

export function ParallaxLayer({
  children,
  className,
  style,
  speedY,
  speedX,
  scaleEnter,
  zIndex,
}: ParallaxLayerProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const { registerLayer, unregisterLayer } = useParallaxContext()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    registerLayer(id, el, { speedY, speedX, scaleEnter })
    return () => unregisterLayer(id)
  }, [id, registerLayer, unregisterLayer, speedY, speedX, scaleEnter])

  return (
    <div
      ref={ref}
      className={cn('pointer-events-none absolute', className)}
      style={{ zIndex, willChange: 'transform', ...style }}
      aria-hidden={zIndex !== undefined && zIndex < 20}
    >
      {children}
    </div>
  )
}
