let routePrefetchStarted = false
let dataPrefetchStarted = false

/** Download the /products page JS chunk before the user navigates. */
export function prefetchProductsRoute(): void {
  if (routePrefetchStarted) return
  routePrefetchStarted = true
  void import('@/pages/customer/PrimeProductsPage')
}

/** Warm product + category caches used on the products page. */
export function prefetchProductsData(): void {
  if (dataPrefetchStarted) return
  dataPrefetchStarted = true

  void import('@/services/products').then(({ getProducts, getCachedCatalogueProducts }) => {
    if (getCachedCatalogueProducts()?.length) return
    void getProducts({ sortBy: 'sort_order', lite: true }).catch(() => undefined)
  })

  void import('@/services/categories').then(({ getCategories, getCachedCatalogueCategories }) => {
    if (getCachedCatalogueCategories()?.length) return
    void getCategories().catch(() => undefined)
  })
}

export function warmupProductsPage(): void {
  prefetchProductsRoute()
  prefetchProductsData()
}
