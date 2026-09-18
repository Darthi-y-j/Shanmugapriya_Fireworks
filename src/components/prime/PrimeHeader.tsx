import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Heart, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { SITE_UI_LOGO_PATH } from '@/lib/siteConfig'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { cn } from '@/lib/utils'
import { warmupProductsPage } from '@/lib/prefetchProductsRoute'

type NavItem = { to: string; label: string; isShop?: boolean }

const NAV: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function PrimeHeader() {
  const { isAdmin, isCustomer, user } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: likedCount } = useWishlist()
  const { scrollToShop } = usePrimeShop()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  const isActive = (link: NavItem) => {
    if (link.label === 'Home') return location.pathname === '/'
    if (link.label === 'FAQ') return location.pathname === '/faq'
    if (link.label === 'Products') {
      return location.pathname === '/products' || (location.pathname === '/' && location.hash === '#shop')
    }
    return location.pathname === link.to
  }

  const accountPath = isAdmin ? '/admin' : user && isCustomer ? '/account' : '/login'
  const accountLabel = isAdmin ? 'Admin' : user && isCustomer ? 'My Account' : 'Login'

  const handleNavClick = (link: NavItem) => {
    if (link.label === 'Products') warmupProductsPage()
    if (link.isShop) scrollToShop()
    setMobileMenuOpen(false)
  }

  const handleProductsWarmup = () => {
    warmupProductsPage()
  }

  return (
    <header className="prime-header sticky top-0 z-50 m-0 px-2 pt-2 transition-all duration-300 sm:px-4 sm:pt-3 lg:px-5 lg:pt-4">
      <div
        className={cn(
          'mx-auto max-w-7xl overflow-hidden border transition-all duration-300',
          'rounded-2xl sm:rounded-[1.75rem] lg:rounded-full',
          'border-white/15 bg-[#0F2847]/55 backdrop-blur-xl',
          mobileMenuOpen && 'bg-[#0F2847]/95 shadow-[0_16px_48px_rgba(15,40,71,0.45)]',
          !mobileMenuOpen && scrolled
            ? 'shadow-[0_12px_40px_rgba(15,40,71,0.35)] bg-[#0F2847]/72'
            : !mobileMenuOpen && 'shadow-[0_8px_32px_rgba(15,40,71,0.22)]',
        )}
      >
        <div className="px-2.5 sm:px-5">
          <div className="flex h-[56px] items-center justify-between gap-2 sm:h-[60px] lg:h-[68px] lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-3">
            <Link to="/" className="group flex min-w-0 items-center gap-2.5 justify-self-start sm:gap-3">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#C9A24A] to-[#E8C56A] opacity-70 blur-[1px] transition group-hover:opacity-100"
                  aria-hidden="true"
                />
                <img
                  src={SITE_UI_LOGO_PATH}
                  width={48}
                  height={48}
                  alt={SHANMUGA_BRAND.displayName}
                  className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white sm:h-12 sm:w-12"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-[0.95rem] font-bold leading-tight text-white sm:text-lg">
                  {SHANMUGA_BRAND.shortName}
                </p>
                <p className="mt-0.5 hidden items-center gap-2 sm:flex">
                  <span className="h-px w-4 bg-[#C9A24A]/80" aria-hidden="true" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    Sivakasi · Est. 1999
                  </span>
                </p>
              </div>
            </Link>

            <nav
              className="hidden items-center gap-1 rounded-full border border-white/12 bg-white/8 p-1 lg:flex lg:justify-self-center"
              aria-label="Main navigation"
            >
              {NAV.map((link) => {
                const active = isActive(link)
                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onMouseEnter={link.label === 'Products' ? handleProductsWarmup : undefined}
                    onFocus={link.label === 'Products' ? handleProductsWarmup : undefined}
                    onTouchStart={link.label === 'Products' ? handleProductsWarmup : undefined}
                    onClick={() => {
                      if (link.label === 'Products') handleProductsWarmup()
                      if (link.isShop) scrollToShop()
                    }}
                    className={cn(
                      'rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-200',
                      active
                        ? 'bg-white/20 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] ring-1 ring-white/25'
                        : 'text-white/75 hover:bg-white/12 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5 lg:justify-self-end">
              <Link
                to="/contact"
                className="group hidden items-center gap-2 overflow-hidden rounded-full bg-[#C9A24A] px-4 py-2.5 text-sm font-bold text-[#0F2847] shadow-[0_4px_16px_rgba(201,162,74,0.35)] ring-1 ring-white/20 transition hover:bg-[#E8C56A] hover:shadow-[0_6px_20px_rgba(201,162,74,0.45)] md:inline-flex"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#0F2847]" aria-hidden="true" />
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="flex items-center rounded-full border border-white/15 bg-white/10 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm sm:p-1">
                <Link
                  to="/wishlist"
                  className="relative rounded-full p-1.5 text-white transition hover:bg-white/15 sm:p-2"
                  aria-label={`Wishlist${likedCount > 0 ? `, ${likedCount} items` : ''}`}
                >
                  <Heart
                    className={cn('h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]', likedCount > 0 && 'fill-[#C9A24A] text-[#C9A24A]')}
                  />
                </Link>

                <span className="h-5 w-px bg-white/20" aria-hidden="true" />

                <Link
                  to="/cart"
                  className="relative rounded-full p-1.5 text-white transition hover:bg-white/15 sm:p-2"
                  aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
                >
                  <ShoppingCart className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                  {itemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C9A24A] px-0.5 text-[9px] font-bold text-[#0F2847] ring-2 ring-[#0F2847]/40">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>

                <span className="h-5 w-px bg-white/20" aria-hidden="true" />

                <Link
                  to={accountPath}
                  className="rounded-full p-1.5 text-white transition hover:bg-white/15 sm:p-2"
                  aria-label={accountLabel}
                >
                  <User className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </Link>

                <span className="h-5 w-px bg-white/20 lg:hidden" aria-hidden="true" />

                <button
                  type="button"
                  className="rounded-full p-1.5 text-white transition hover:bg-white/15 sm:p-2 lg:hidden"
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" /> : <Menu className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out lg:hidden',
              mobileMenuOpen
                ? 'max-h-[min(20rem,72dvh)] opacity-100'
                : 'pointer-events-none max-h-0 opacity-0',
            )}
          >
            <nav className="border-t border-white/15 pb-2.5 pt-2" aria-label="Mobile navigation">
              <div className="flex flex-col">
                {NAV.map((link) => {
                  const active = isActive(link)
                  return (
                    <Link
                      key={`mobile-${link.label}`}
                      to={link.to}
                      onTouchStart={link.label === 'Products' ? handleProductsWarmup : undefined}
                      onClick={() => handleNavClick(link)}
                      className={cn(
                        'flex items-center justify-between border-b border-white/8 px-2 py-2 text-[13px] font-semibold transition last:border-b-0',
                        active
                          ? 'text-white'
                          : 'text-white/75 active:bg-white/10',
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        {active && (
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[#C9A24A]" aria-hidden="true" />
                        )}
                        {link.label}
                      </span>
                      <ArrowRight className={cn('h-3 w-3 shrink-0', active ? 'text-[#C9A24A]' : 'text-white/30')} />
                    </Link>
                  )
                })}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to={accountPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/8 px-2 py-2 text-[12px] font-semibold text-white transition active:bg-white/15"
                >
                  <User className="h-3.5 w-3.5 text-[#C9A24A]" aria-hidden="true" />
                  {accountLabel}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#C9A24A] px-2 py-2 text-[12px] font-bold text-[#0F2847] shadow-sm active:bg-[#E8C56A]"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
