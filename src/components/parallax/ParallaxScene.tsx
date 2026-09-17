import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ParallaxContext, type ParallaxLayerConfig } from '@/components/parallax/parallaxContext'

type LayerEntry = ParallaxLayerConfig & { el: HTMLElement }

function getMotionMultiplier(): number {
  if (typeof window === 'undefined') return 1
  const w = window.innerWidth
  if (w < 640) return 0.28
  if (w < 1024) return 0.58
  return 1
}

export function ParallaxScene({
  children,
  className,
  minHeight = 'min-h-[92vh]',
}: {
  children: ReactNode
  className?: string
  minHeight?: string
}) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<Map<string, LayerEntry>>(new Map())
  const rafRef = useRef(0)
  const reducedRef = useRef(false)

  const registerLayer = useCallback((id: string, el: HTMLElement, config: ParallaxLayerConfig) => {
    layersRef.current.set(id, { el, ...config })
  }, [])

  const unregisterLayer = useCallback((id: string) => {
    layersRef.current.delete(id)
  }, [])

  const update = useCallback(() => {
    const scene = sceneRef.current
    if (!scene) return

    const rect = scene.getBoundingClientRect()
    const vh = window.innerHeight
    const centerOffset = rect.top + rect.height / 2 - vh / 2
    const enterProgress = Math.max(0, Math.min(1, (vh - rect.top) / vh))
    const multiplier = reducedRef.current ? 0 : getMotionMultiplier()

    layersRef.current.forEach(({ el, speedY, speedX = 0, scaleEnter }) => {
      const y = centerOffset * speedY * multiplier
      const x = centerOffset * speedX * multiplier
      let scale = 1
      if (scaleEnter && multiplier > 0) {
        scale = 1 + enterProgress * (scaleEnter - 1)
      }
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    })
  }, [])

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches
      update()
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', onMotionChange)

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mq.removeEventListener('change', onMotionChange)
    }
  }, [update])

  const contextValue = useMemo(
    () => ({ registerLayer, unregisterLayer }),
    [registerLayer, unregisterLayer],
  )

  return (
    <ParallaxContext.Provider value={contextValue}>
      <div
        ref={sceneRef}
        className={cn('relative overflow-hidden', minHeight, className)}
      >
        {children}
      </div>
    </ParallaxContext.Provider>
  )
}
