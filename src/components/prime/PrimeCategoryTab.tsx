import { useEffect, useState } from 'react'
import { PrimeFilterDrawer } from '@/components/prime/PrimeFilterDrawer'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import type { Category } from '@/types/database'

export function PrimeCategoryTab() {
  const {
    activeCategory,
    setActiveCategory,
    categoryDrawerOpen,
    setCategoryDrawerOpen,
    scrollToCategory,
    scrollToShop,
  } = usePrimeShop()
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])

  useEffect(() => {
    void getCategories()
      .then(setCategories)
      .catch(() => undefined)
  }, [])

  const handleSelectCategory = (categoryId: string) => {
    if (!categoryId) {
      setActiveCategory('')
      scrollToShop()
      return
    }
    scrollToCategory(categoryId)
  }

  return (
    <PrimeFilterDrawer
      open={categoryDrawerOpen}
      onOpenChange={setCategoryDrawerOpen}
      categories={categories}
      activeCategory={activeCategory}
      onSelectCategory={handleSelectCategory}
      showTab
    />
  )
}
