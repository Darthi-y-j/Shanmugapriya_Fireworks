import { Link } from 'react-router-dom'
import {
  User,
  MapPin,
  MessageSquare,
  Heart,
  Shield,
  HelpCircle,
  Phone,
  LogOut,
  Mail,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  AccountPageHeader,
  MenuLink,
  MenuSection,
  ProfileAvatar,
  QuickActionCard,
  StatCard,
  accountContentClass,
} from '@/components/customer/account/AccountUI'
import { useAccountProfile } from '@/contexts/AccountProfileContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatDisplayPhone } from '@/lib/businessInfo'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function AccountDashboard() {
  const { displayName, email, phone, memberSince, enquiryStats, loading } = useAccountProfile()
  const { signOut } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (loading) {
    return (
      <div className="py-16">
        <LoadingState message="Loading your profile..." />
      </div>
    )
  }

  const stats = [
    { value: enquiryStats.total, label: 'Enquiries', accent: '#0F2847' },
    { value: enquiryStats.new, label: 'New', accent: '#0077B6' },
    { value: enquiryStats.completed, label: 'Completed', accent: '#1A3D66' },
    { value: wishlistCount, label: 'Wishlist', accent: '#0077B6' },
  ]

  return (
    <>
      <SEO title="My Profile" description="Manage your Shanmuga Priya Crackers account and enquiries." noIndex />

      <AccountPageHeader showEdit>
        <div className="mt-6 flex flex-col items-center gap-5 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
            <ProfileAvatar name={displayName} />
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl lg:text-4xl">
                {displayName}
              </h1>
              <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start">
                {email && (
                  <p className="flex items-center justify-center gap-2 text-sm text-white/85 lg:justify-start">
                    <Mail className="h-4 w-4 shrink-0 text-[#0077B6]" />
                    <span className="truncate">{email}</span>
                  </p>
                )}
                {phone && (
                  <p className="flex items-center justify-center gap-2 text-sm text-white/85 lg:justify-start">
                    <Phone className="h-4 w-4 shrink-0 text-[#0077B6]" />
                    {formatDisplayPhone(phone)}
                  </p>
                )}
              </div>
              {memberSince && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#0077B6]/35 bg-[#0077B6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0077B6]">
                  <Sparkles className="h-3 w-3" />
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>
        </div>
      </AccountPageHeader>

      {/* Stats — edge to edge */}
      <section className="grid w-full grid-cols-2 border-y border-[#0F2847]/10 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              'px-3 py-4 sm:px-4 sm:py-5',
              index % 2 === 0 && 'border-r border-[#0F2847]/10 sm:border-r',
              index < 2 && 'border-b border-[#0F2847]/10 sm:border-b-0',
              index < 3 && 'sm:border-r sm:border-[#0F2847]/10',
            )}
          >
            <StatCard value={stat.value} label={stat.label} accent={stat.accent} tinted />
          </div>
        ))}
      </section>

      <div className={cn(accountContentClass, 'space-y-6')}>
        {itemCount > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-[#0077B6]/35 p-5 shadow-lg sm:p-6 lg:flex lg:items-center lg:justify-between lg:gap-6">
            <OptimizedBackground src={SHANMUGA_BRAND.aboutHeaderBg} />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0F2847]/92 via-[#0A1F38]/88 to-[#0F2847]/85"
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between gap-4 lg:flex-1 lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0077B6]">Your cart</p>
                <p className="mt-1 font-display text-xl font-extrabold text-white sm:text-2xl">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} ready to enquire
                </p>
                <p className="mt-1 text-sm text-white/75">Send your list on WhatsApp in one tap.</p>
              </div>
              <ShoppingCart className="h-10 w-10 shrink-0 text-[#0077B6]/80 lg:order-last" />
            </div>
            <div className="relative mt-4 flex flex-wrap gap-2 lg:mt-0 lg:shrink-0">
              <Link
                to="/"
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Continue shopping
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0077B6] px-4 py-2 text-xs font-bold text-[#0F2847] transition hover:bg-[#0096D6]"
              >
                WhatsApp enquiry
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F2847]/55">
            Quick access
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              to="/account/personal"
              label="Personal info"
              description="Name, email & phone"
              accent="#0F2847"
              icon={<User className="h-5 w-5 text-[#0F2847]" />}
            />
            <QuickActionCard
              to="/account/addresses"
              label="My addresses"
              description="Delivery locations"
              accent="#1A3D66"
              icon={<MapPin className="h-5 w-5 text-[#1A3D66]" />}
            />
            <QuickActionCard
              to="/account/enquiries"
              label="My enquiries"
              description="Track your orders"
              accent="#0077B6"
              icon={<MessageSquare className="h-5 w-5 text-[#0077B6]" />}
            />
            <QuickActionCard
              to="/account/wishlist"
              label="Wishlist"
              description="Saved favourites"
              accent="#C62828"
              icon={<Heart className="h-5 w-5 text-[#C62828]" />}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <MenuSection title="Settings" accent="#1A3D66">
            <MenuLink
              to="/account/security"
              icon={<Shield className="h-5 w-5 text-[#1A3D66]" />}
              label="Password & security"
              description="Change your password"
              accent="#1A3D66"
            />
          </MenuSection>

          <MenuSection title="Support" accent="#0077B6">
            <MenuLink
              to="/account/help"
              icon={<HelpCircle className="h-5 w-5 text-[#0F2847]" />}
              label="Help & support"
              description="FAQ, delivery, terms & more"
            />
            <MenuLink
              to="/contact"
              icon={<Phone className="h-5 w-5 text-[#0077B6]" />}
              label="Contact us"
              accent="#0077B6"
            />
          </MenuSection>
        </div>

        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0F2847] bg-[#0F2847] py-3.5 text-sm font-bold text-white shadow-md transition hover:border-[#1A3D66] hover:bg-[#1A3D66] lg:max-w-xs"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Sign out?"
        message="You will need to sign in again to access your profile and enquiries."
        confirmLabel="Logout"
        onConfirm={() => {
          setLogoutOpen(false)
          void signOut()
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  )
}
