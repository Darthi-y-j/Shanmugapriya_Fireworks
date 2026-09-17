import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { PrimeLayout } from '@/layouts/PrimeLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoadingState } from '@/components/customer/LoadingState'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { LoginPage } from '@/pages/customer/LoginPage'
import { RegisterPage } from '@/pages/customer/RegisterPage'
import { ForgotPasswordPage } from '@/pages/customer/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/customer/ResetPasswordPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { warmupProductsPage } from '@/lib/prefetchProductsRoute'

const HomePage = lazy(() => import('@/pages/customer/HomePage').then((m) => ({ default: m.HomePage })))
const AboutPage = lazy(() => import('@/pages/customer/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() =>
  import('@/pages/customer/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const CartPage = lazy(() => import('@/pages/customer/CartPage').then((m) => ({ default: m.CartPage })))
const PrimeLikesPage = lazy(() =>
  import('@/pages/customer/PrimeLikesPage').then((m) => ({ default: m.PrimeLikesPage })),
)
const PrimeProductDetailPage = lazy(() =>
  import('@/pages/customer/PrimeProductDetailPage').then((m) => ({
    default: m.PrimeProductDetailPage,
  })),
)
const AccountPage = lazy(() => import('@/pages/customer/AccountPage').then((m) => ({ default: m.AccountPage })))
const AuthConfirmPage = lazy(() =>
  import('@/pages/customer/AuthConfirmPage').then((m) => ({ default: m.AuthConfirmPage })),
)
const FAQPage = lazy(() => import('@/pages/customer/FAQPage').then((m) => ({ default: m.FAQPage })))
const SafetyPage = lazy(() => import('@/pages/customer/SafetyPage').then((m) => ({ default: m.SafetyPage })))
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/customer/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const TermsPage = lazy(() => import('@/pages/customer/TermsPage').then((m) => ({ default: m.TermsPage })))
const DeliveryPage = lazy(() =>
  import('@/pages/customer/DeliveryPage').then((m) => ({ default: m.DeliveryPage })),
)
const PrimeProductsPage = lazy(() =>
  import('@/pages/customer/PrimeProductsPage').then((m) => ({ default: m.PrimeProductsPage })),
)
const PaymentPolicyPage = lazy(() =>
  import('@/pages/customer/PaymentPolicyPage').then((m) => ({ default: m.PaymentPolicyPage })),
)

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminProductsPage = lazy(() =>
  import('@/pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })),
)
const AdminProductFormPage = lazy(() =>
  import('@/pages/admin/AdminProductFormPage').then((m) => ({ default: m.AdminProductFormPage })),
)
const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })),
)
const AdminCategoryFormPage = lazy(() =>
  import('@/pages/admin/AdminCategoryFormPage').then((m) => ({ default: m.AdminCategoryFormPage })),
)
const AdminEnquiriesPage = lazy(() =>
  import('@/pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage })),
)
const AdminOrderEnquiriesPage = lazy(() =>
  import('@/pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminOrderEnquiriesPage })),
)
const AdminCustomersPage = lazy(() =>
  import('@/pages/admin/AdminCustomersPage').then((m) => ({ default: m.AdminCustomersPage })),
)
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })),
)
const AdminNewsletterPage = lazy(() =>
  import('@/pages/admin/AdminNewsletterPage').then((m) => ({ default: m.AdminNewsletterPage })),
)

function PageLoader() {
  return (
    <div className="py-16">
      <LoadingState message="Loading..." />
    </div>
  )
}

function App() {
  useEffect(() => {
    const scheduleWarmup = () => warmupProductsPage()
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(scheduleWarmup, { timeout: 2500 })
    } else {
      setTimeout(scheduleWarmup, 1200)
    }
  }, [])

  return (
    <HelmetProvider>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
            <ToastProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route element={<PrimeLayout />}>
                      <Route path="/auth/confirm" element={<AuthConfirmPage />} />
                      <Route path="/" element={<HomePage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/gallery" element={<Navigate to="/faq" replace />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/wishlist" element={<PrimeLikesPage />} />
                      <Route path="/products" element={<PrimeProductsPage />} />
                      <Route path="/products/:slug" element={<PrimeProductDetailPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/account/*" element={<AccountPage />} />
                      {/* Redirect unused catalogue routes to home */}
                      <Route path="/categories" element={<Navigate to="/" replace />} />
                      <Route path="/categories/:slug" element={<Navigate to="/" replace />} />
                      <Route path="/search" element={<Navigate to="/" replace />} />
                      <Route path="/gift-box" element={<Navigate to="/" replace />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/delivery" element={<DeliveryPage />} />
                      <Route path="/why-no-online-payment" element={<PaymentPolicyPage />} />
                      <Route path="/safety" element={<SafetyPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                    </Route>

                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="products/new" element={<AdminProductFormPage />} />
                      <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="categories/new" element={<AdminCategoryFormPage />} />
                      <Route path="categories/:id/edit" element={<AdminCategoryFormPage />} />
                      <Route path="enquiries" element={<AdminEnquiriesPage />} />
                      <Route path="orders" element={<AdminOrderEnquiriesPage />} />
                      <Route path="customers" element={<AdminCustomersPage />} />
                      <Route path="newsletter" element={<AdminNewsletterPage />} />
                      <Route path="settings" element={<AdminSettingsPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
