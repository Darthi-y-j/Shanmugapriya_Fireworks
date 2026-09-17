import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomerRoute } from '@/components/customer/CustomerRoute'
import { AccountProfileProvider } from '@/contexts/AccountProfileContext'
import { AccountDashboard } from '@/pages/customer/account/AccountDashboard'
import { PersonalInfoPage } from '@/pages/customer/account/PersonalInfoPage'
import { AddressesPage } from '@/pages/customer/account/AddressesPage'
import { EnquiriesPage } from '@/pages/customer/account/EnquiriesPage'
import { AccountWishlistPage } from '@/pages/customer/account/AccountWishlistPage'
import { SecurityPage } from '@/pages/customer/account/SecurityPage'
import { HelpSupportPage } from '@/pages/customer/account/HelpSupportPage'
import { FestivePageBackground } from '@/components/customer/FestivePageBackground'

function AccountRoutes() {
  return (
    <FestivePageBackground className="pb-28 sm:pb-10">
      <Routes>
          <Route index element={<AccountDashboard />} />
          <Route path="personal" element={<PersonalInfoPage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="orders" element={<Navigate to="/account/enquiries" replace />} />
          <Route path="wishlist" element={<AccountWishlistPage />} />
          <Route path="coupons" element={<Navigate to="/account" replace />} />
          <Route path="preferences" element={<Navigate to="/account/help" replace />} />
          <Route path="notifications" element={<Navigate to="/account/help" replace />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="help" element={<HelpSupportPage />} />
        </Routes>
    </FestivePageBackground>
  )
}

export function AccountPage() {
  return (
    <CustomerRoute>
      <AccountProfileProvider>
        <AccountRoutes />
      </AccountProfileProvider>
    </CustomerRoute>
  )
}
