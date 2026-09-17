import { createContext, useContext, useState, type ReactNode } from 'react'

type HeroSlideTheme = 'dark' | 'light'

interface HeroSlideContextValue {
  theme: HeroSlideTheme
  setTheme: (theme: HeroSlideTheme) => void
}

const HeroSlideContext = createContext<HeroSlideContextValue | null>(null)

export function HeroSlideProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<HeroSlideTheme>('dark')

  return (
    <HeroSlideContext.Provider value={{ theme, setTheme }}>
      {children}
    </HeroSlideContext.Provider>
  )
}

export function useHeroSlideTheme() {
  const context = useContext(HeroSlideContext)
  if (!context) {
    throw new Error('useHeroSlideTheme must be used within HeroSlideProvider')
  }
  return context
}
