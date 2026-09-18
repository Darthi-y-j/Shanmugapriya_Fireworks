import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { PrimeHeader } from '@/components/prime/PrimeHeader'
import { PrimeFooter } from '@/components/prime/PrimeFooter'
import { PrimeCartBar } from '@/components/prime/PrimeCartBar'
import { PrimeCategoryTab } from '@/components/prime/PrimeCategoryTab'
import { PrimeShopProvider } from '@/contexts/PrimeShopContext'
import { RouteSEO } from '@/components/shared/RouteSEO'
import { SiteBrandSchema } from '@/components/shared/SiteBrandSchema'
import { ToastContainer } from '@/components/customer/Toast'
import { ImportantNoticeModal } from '@/components/customer/ImportantNoticeModal'
import { ScrollRevealInit } from '@/components/shared/ScrollRevealInit'
import { FloatingActionButtons } from '@/components/customer/FloatingActionButtons'
import { preloadSiteImagesDeferred } from '@/lib/preloadSiteImages'
import { cn } from '@/lib/utils'

export function PrimeLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/' || location.pathname === '/home'
  const isProductsPage = location.pathname === '/products'
  const isCartPage = location.pathname === '/cart'
  const isContactPage = location.pathname === '/contact'
  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/admin/login',
  ].includes(location.pathname)
  const showCategoryDrawer = isProductsPage
  const showCartBar =
    !isCartPage &&
    (isHome ||
      location.pathname === '/products' ||
      location.pathname === '/wishlist' ||
      location.pathname.startsWith('/products/'))

  useEffect(() => {
    preloadSiteImagesDeferred(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    if (location.hash !== '#shop') return

    if (isHome) {
      navigate('/products', { replace: true })
      return
    }

    if (location.pathname === '/products') {
      requestAnimationFrame(() => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.hash, location.pathname, isHome, navigate])

  return (
    <PrimeShopProvider>
      <ScrollRevealInit />
      <div className="prime-shop flex min-h-screen flex-col bg-white">
        <RouteSEO />
        <SiteBrandSchema />
        <ImportantNoticeModal />
        <PrimeHeader />
        {showCategoryDrawer && <PrimeCategoryTab />}
        <main className={cn('flex-1', showCartBar && 'pb-20', isAuthPage && 'pb-0')}>
          <Outlet />
        </main>
        {!isAuthPage && <PrimeFooter />}
        {showCartBar && <PrimeCartBar />}
        {!isContactPage && !isAuthPage && (
          <FloatingActionButtons
            showYouTube={isHome}
            className={showCartBar ? 'bottom-24 sm:bottom-28' : undefined}
          />
        )}
        <ToastContainer />
      </div>
    </PrimeShopProvider>
  )
}
