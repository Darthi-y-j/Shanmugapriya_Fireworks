import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface PrimeShopContextValue {
  search: string
  setSearch: (value: string) => void
  activeCategory: string
  setActiveCategory: (id: string) => void
  categoryDrawerOpen: boolean
  setCategoryDrawerOpen: (open: boolean) => void
  scrollToShop: () => void
  scrollToCategory: (categoryId: string) => void
}

const PrimeShopContext = createContext<PrimeShopContextValue | undefined>(undefined)

function scrollToShopSection(categoryId?: string) {
  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  if (!categoryId) return

  window.setTimeout(() => {
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 200)
}

export function PrimeShopProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)

  const scrollToShop = useCallback(() => {
    if (location.pathname === '/products') {
      scrollToShopSection()
      return
    }

    navigate('/products')
  }, [location.pathname, navigate])

  const scrollToCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId)

      if (location.pathname !== '/products') {
        navigate('/products')
        if (categoryId) {
          window.setTimeout(() => scrollToShopSection(categoryId), 300)
        }
        return
      }

      scrollToShopSection(categoryId)
    },
    [location.pathname, navigate],
  )

  return (
    <PrimeShopContext.Provider
      value={{
        search,
        setSearch,
        activeCategory,
        setActiveCategory,
        categoryDrawerOpen,
        setCategoryDrawerOpen,
        scrollToShop,
        scrollToCategory,
      }}
    >
      {children}
    </PrimeShopContext.Provider>
  )
}

export function usePrimeShop() {
  const ctx = useContext(PrimeShopContext)
  if (!ctx) throw new Error('usePrimeShop must be used within PrimeShopProvider')
  return ctx
}
