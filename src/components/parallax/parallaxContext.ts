import { createContext, useContext } from 'react'

export type ParallaxLayerConfig = {
  speedY: number
  speedX?: number
  scaleEnter?: number
}

export type ParallaxContextValue = {
  registerLayer: (id: string, el: HTMLElement, config: ParallaxLayerConfig) => void
  unregisterLayer: (id: string) => void
}

export const ParallaxContext = createContext<ParallaxContextValue | null>(null)

export function useParallaxContext() {
  const ctx = useContext(ParallaxContext)
  if (!ctx) throw new Error('ParallaxLayer must be used inside ParallaxScene')
  return ctx
}
