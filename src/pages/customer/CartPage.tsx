import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Trash2,
  ShoppingBag,
  MessageCircle,
  Loader2,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Package,
  Gift,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Minus,
  Plus,
  ClipboardList,
  Zap,
  ChevronRight,
  Ticket,
} from 'lucide-react'
import { PAYMENT_POLICY_PATH } from '@/lib/paymentPolicyContent'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { ProductImage } from '@/components/customer/ProductImage'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { SpinToWinWheel } from '@/components/customer/SpinToWinWheel'
import { createCartEnquiry } from '@/services/enquiries'
import { buildCartWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import type { SpinReward } from '@/lib/spinToWin'
import type { CartEnquiryFormData } from '@/types/database'
import { getCurrentDeliveryAddress, geolocationErrorMessage } from '@/lib/geolocation'
import {
  buildFullDeliveryAddress,
  emptyAddressFields,
  validateDeliveryAddress,
  type DeliveryAddressFields,
} from '@/lib/deliveryAddress'
import { isReferralCodeValid, normalizeReferralCode } from '@/lib/referralCode'
import { formatPrice, validatePhone, cn } from '@/lib/utils'
import { formatDisplayPhone } from '@/lib/businessInfo'
import type { CartItem } from '@/types/database'

import {
  CartLikesHero,
  CartLikesPageShell,
  cartLikesHeroAccentClass,
  cartLikesHeroBadgeClass,
  cartLikesHeroBreadcrumbClass,
  cartLikesHeroBreadcrumbCurrentClass,
  cartLikesHeroChipClass,
  cartLikesHeroIconAccentClass,
  cartLikesHeroMutedClass,
  cartLikesHeroTitleClass,
} from '@/components/customer/CartLikesHero'

const inputClass =
  'w-full rounded-xl border border-[#0F2847]/12 bg-white px-3.5 py-2.5 text-sm text-[#0F2847] placeholder:text-slate-400 transition focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25'

const journeySteps = [
  { icon: ClipboardList, label: 'Review cart' },
  { icon: User, label: 'Your details' },
  { icon: MessageCircle, label: 'WhatsApp send' },
]

function CartQuantityControls({
  value,
  onChange,
}: {
  value: number
  onChange: (qty: number) => void
}) {
  return (
    <div className="flex h-9 items-stretch overflow-hidden rounded-lg bg-[#FFF8E1]/80 shadow-sm ring-1 ring-[#0F2847]/12 sm:h-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex w-9 items-center justify-center text-[#0F2847] transition hover:bg-[#0F2847]/5 disabled:opacity-35 sm:w-10"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
      <span className="flex min-w-[2rem] flex-1 items-center justify-center border-x border-[#0F2847]/10 text-xs font-extrabold tabular-nums text-[#0F2847] sm:min-w-[2.25rem] sm:text-sm">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex w-9 items-center justify-center bg-gradient-to-r from-[#0F2847] to-[#1A3D66] text-white transition hover:from-[#1A3D66] hover:to-[#00838f] sm:w-10"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  )
}

function CartItemCard({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  index: number
  onUpdateQuantity: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}) {
  const lineTotal = item.price != null ? item.price * item.quantity : null
  const isGiftBox = Boolean(item.isGiftBox)

  const title = isGiftBox ? (
    <p className="line-clamp-2 font-display text-base font-extrabold leading-snug text-[#0F2847] sm:text-lg">
      {item.productName}
    </p>
  ) : (
    <Link
      to={`/products/${item.slug}`}
      className="line-clamp-2 font-display text-base font-extrabold leading-snug text-[#0F2847] transition hover:text-[#1A3D66] sm:text-lg"
    >
      {item.productName}
    </Link>
  )

  const imageBlock = (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#0F2847]/8 via-[#FFF8E1] to-[#0077B6]/15 ring-1 ring-[#0F2847]/10">
      {item.imageUrl ? (
        <ProductImage src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[#0F2847]/35">
          <Sparkles className="h-7 w-7 text-[#0077B6]/70" />
          <Package className="h-5 w-5" />
        </div>
      )}
      {isGiftBox && (
        <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F2847] text-[#0077B6] shadow-md ring-2 ring-white">
          <Gift className="h-3 w-3" />
        </span>
      )}
      <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#0077B6] font-display text-[10px] font-extrabold text-[#0F2847] shadow-sm">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )

  return (
    <AnimateIn animation="fade-up" delay={40 + index * 40}>
      <article
        className="group relative overflow-hidden rounded-2xl border border-[#0F2847]/10 bg-white p-3 shadow-sm transition hover:border-[#0077B6]/45 hover:shadow-md sm:p-4"
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#1A3D66] via-[#0F2847] to-[#0A1F38]"
          aria-hidden="true"
        />

        <div className="grid grid-cols-[5.5rem_1fr] gap-3 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
          <div className="shrink-0">
            {isGiftBox ? imageBlock : <Link to={`/products/${item.slug}`}>{imageBlock}</Link>}
          </div>

          <div className="flex min-w-0 flex-col gap-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                {title}
                <div className="flex flex-wrap items-center gap-1.5">
                  {item.pieces != null && item.pieces > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0F2847]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#0F2847] sm:text-[10px]">
                      {item.pieces} pcs / unit
                    </span>
                  )}
                  {isGiftBox && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0077B6]/25 px-2 py-0.5 text-[9px] font-bold uppercase text-[#0F2847]">
                      Gift box
                    </span>
                  )}
                </div>
              </div>

              {lineTotal != null && (
                <div className="shrink-0 text-right">
                  <p className="text-lg font-extrabold tabular-nums leading-none text-[#0077B6] sm:text-xl">
                    {formatPrice(lineTotal)}
                  </p>
                  {item.quantity > 1 && item.price != null && (
                    <p className="mt-0.5 text-[10px] tabular-nums text-slate-500">
                      {formatPrice(item.price)} each
                    </p>
                  )}
                </div>
              )}
            </div>

            {isGiftBox && item.giftBoxItems && item.giftBoxItems.length > 0 && (
              <ul className="space-y-0.5 rounded-xl border border-dashed border-[#0077B6]/40 bg-[#FFF8E1]/50 px-2.5 py-2 text-[11px] text-[#0F2847]/80">
                {item.giftBoxItems.map((inner) => (
                  <li key={inner.productId} className="flex justify-between gap-2">
                    <span className="truncate">{inner.productName}</span>
                    <span className="shrink-0 font-semibold">×{inner.quantity}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between gap-2 pt-0.5">
              <CartQuantityControls
                value={item.quantity}
                onChange={(qty) => onUpdateQuantity(item.productId, qty)}
              />
              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500 sm:h-10"
                aria-label={`Remove ${item.productName}`}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </AnimateIn>
  )
}

function EnquiryForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  addressFields,
  updateAddress,
  customerMessage,
  setCustomerMessage,
  referralCode,
  setReferralCode,
  locating,
  loading,
  isLoggedIn,
  customerEmail,
  settings,
  itemCount,
  estimatedTotal,
  hasPricedItems,
  spinReward,
  onUseLocation,
  onSendEnquiry,
  className,
}: {
  customerName: string
  setCustomerName: (v: string) => void
  customerPhone: string
  setCustomerPhone: (v: string) => void
  addressFields: DeliveryAddressFields
  updateAddress: (patch: Partial<DeliveryAddressFields>) => void
  customerMessage: string
  setCustomerMessage: (v: string) => void
  referralCode: string
  setReferralCode: (v: string) => void
  locating: boolean
  loading: boolean
  isLoggedIn: boolean
  customerEmail?: string
  settings: ReturnType<typeof useSettings>['settings']
  itemCount: number
  estimatedTotal: number
  hasPricedItems: boolean
  spinReward: SpinReward | null
  onUseLocation: () => void
  onSendEnquiry: () => void
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {hasPricedItems && (
        <div className="overflow-hidden rounded-2xl border border-[#0077B6]/35 bg-gradient-to-br from-[#0F2847] via-[#005a64] to-[#1A3D66] p-4 text-white shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077B6]/90">
                Order snapshot
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums">
                {formatPrice(estimatedTotal)}
              </p>
              <p className="text-xs text-white/70">{itemCount} item{itemCount !== 1 ? 's' : ''} · price confirmed on WhatsApp</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0077B6]/15 ring-1 ring-[#0077B6]/30">
              <Zap className="h-7 w-7 text-[#0077B6]" />
            </div>
          </div>
          {spinReward && (
            <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-[#0077B6]">
              Spin reward applied: {spinReward.label}
            </p>
          )}
        </div>
      )}

      <div
        id="send-enquiry"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#0F2847]/10 bg-white shadow-[0_12px_40px_rgba(0,77,85,0.1)]"
      >
        <div className="relative border-b border-[#0F2847]/8 bg-[#FFF8E1]/40 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 ring-1 ring-[#25D366]/30">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-[#0F2847]">
                Send Enquiry
              </h2>
              <p className="text-xs text-[#0F2847]/65">One message — our team replies on WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {settings.whatsapp_number && (
            <a
              href={buildWhatsAppUrl(settings.whatsapp_number, 'Hi! I have a cart enquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-1.5 text-xs font-bold text-[#128C7E] transition hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {formatDisplayPhone(settings.whatsapp_number)}
            </a>
          )}

          {isLoggedIn && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#0077B6]/40 bg-[#FFF8E1] px-3 py-1 text-xs font-semibold text-[#0F2847]">
              <BadgeCheck className="h-3.5 w-3.5 text-[#0077B6]" />
              Logged in{customerEmail ? ` · ${customerEmail}` : ''}
            </p>
          )}

          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#0F2847]/70">
                  <User className="h-3.5 w-3.5 text-[#0077B6]" />
                  Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#0F2847]/70">
                  <Phone className="h-3.5 w-3.5 text-[#0077B6]" />
                  Phone *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#0F2847]/10 bg-gradient-to-br from-[#FFF8E1]/60 to-white p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#0F2847]">
                  <MapPin className="h-3.5 w-3.5 text-[#0077B6]" />
                  Delivery address *
                </label>
                <button
                  type="button"
                  onClick={onUseLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1 rounded-full bg-[#0F2847] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-[#1A3D66] disabled:opacity-60"
                >
                  {locating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                  Detect location
                </button>
              </div>

              {addressFields.locationSnapshot ? (
                <div className="mb-3 rounded-xl border border-[#0077B6]/30 bg-white px-3 py-2.5 text-xs leading-relaxed text-[#0F2847]/80">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#0077B6]">Detected area</p>
                  <p className="whitespace-pre-wrap">{addressFields.locationSnapshot}</p>
                </div>
              ) : (
                <p className="mb-3 text-xs text-slate-500">Use detect location, then add door no. and street.</p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={addressFields.doorNo}
                  onChange={(e) => updateAddress({ doorNo: e.target.value })}
                  placeholder="Door / Flat no. *"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) => updateAddress({ street: e.target.value })}
                  placeholder="Street / Building *"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={addressFields.landmark}
                  onChange={(e) => updateAddress({ landmark: e.target.value })}
                  placeholder="Landmark (optional)"
                  className={inputClass}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={addressFields.pincode}
                  onChange={(e) => updateAddress({ pincode: e.target.value })}
                  placeholder="Pincode (optional)"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#0F2847]/70">
                <Ticket className="h-3.5 w-3.5 text-[#0077B6]" />
                Referral code (optional)
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g. PRIME50"
                className={cn(inputClass, 'uppercase tracking-wide')}
                autoComplete="off"
                spellCheck={false}
              />
              {(settings.social_links.referral_codes?.length ?? 0) > 0 && (
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Have a referral code from a friend or partner? Enter it here for special offers.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#0F2847]/70">
                Message (optional)
              </label>
              <textarea
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                placeholder="Event date, bulk order, special notes…"
                rows={3}
                className={cn(inputClass, 'resize-none')}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSendEnquiry}
            disabled={loading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-[#25D366]/35 transition hover:brightness-105 hover:shadow-xl disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <MessageCircle className="h-5 w-5" />
                Send on WhatsApp
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0F2847]" />
            <span>No online payment — enquiry only</span>
            <Link
              to={PAYMENT_POLICY_PATH}
              className="font-semibold text-[#0F2847] underline decoration-[#0077B6]/60 underline-offset-2 hover:text-[#0077B6]"
            >
              Read why
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function CartHero({
  itemCount,
  totalUnits,
}: {
  itemCount: number
  totalUnits: number
}) {
  return (
    <CartLikesHero>
        <nav className={cartLikesHeroBreadcrumbClass}>
          <Link to="/" className="transition hover:text-white">Home</Link>
          <span aria-hidden="true">/</span>
          <span className={cartLikesHeroBreadcrumbCurrentClass}>Cart</span>
        </nav>

        <div className="mt-5 flex flex-col items-center gap-6">
          <div className="mx-auto max-w-xl">
            <div className={cartLikesHeroBadgeClass}>
              <ShoppingBag className={cn('h-3.5 w-3.5', cartLikesHeroIconAccentClass)} />
              {itemCount} item{itemCount !== 1 ? 's' : ''} · {totalUnits} units
            </div>
            <h1 className={cn('mt-3', cartLikesHeroTitleClass)}>
              Cart & <span className={cartLikesHeroAccentClass}>Enquiry</span>
            </h1>
            <p className={cn('mt-3', cartLikesHeroMutedClass)}>
              Build your list, add delivery details, and send one WhatsApp message — we confirm price &amp; stock for you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {journeySteps.map((step, i) => (
              <span
                key={step.label}
                className={cartLikesHeroChipClass}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#0F2847]">
                  {i + 1}
                </span>
                <step.icon className={cn('h-3.5 w-3.5', cartLikesHeroIconAccentClass)} />
                {step.label}
              </span>
            ))}
          </div>
        </div>
    </CartLikesHero>
  )
}

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const { user, isCustomer } = useAuth()
  const location = useLocation()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [addressFields, setAddressFields] = useState<DeliveryAddressFields>(emptyAddressFields)
  const [customerMessage, setCustomerMessage] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [spinReward, setSpinReward] = useState<SpinReward | null>(null)
  const [spinDiscount, setSpinDiscount] = useState(0)
  const [prefilledFromAccount, setPrefilledFromAccount] = useState(false)

  const customerEmail = isCustomer && user?.email ? user.email : undefined

  useEffect(() => {
    if (!isCustomer || !user || prefilledFromAccount) return

    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim()
    const phone = (user.user_metadata?.phone as string | undefined)?.trim()

    if (fullName && !customerName) setCustomerName(fullName)
    if (phone && !customerPhone) setCustomerPhone(phone)
    setPrefilledFromAccount(true)
  }, [isCustomer, user, prefilledFromAccount, customerName, customerPhone])

  useEffect(() => {
    if (location.hash !== '#send-enquiry') return
    requestAnimationFrame(() => {
      document.getElementById('send-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.hash])

  const handleSpinRewardChange = useCallback((reward: SpinReward | null, discount: number) => {
    setSpinReward(reward)
    setSpinDiscount(discount)
  }, [])

  const resetSpinForNewEnquiry = useCallback(() => {
    setSpinReward(null)
    setSpinDiscount(0)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      resetSpinForNewEnquiry()
    }
  }, [items.length, resetSpinForNewEnquiry])

  const estimatedTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.price == null) return sum
        return sum + item.price * item.quantity
      }, 0),
    [items],
  )

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const hasPricedItems = items.some((item) => item.price != null)
  const estimatedAfterSpin = Math.max(0, estimatedTotal - spinDiscount)

  const updateAddress = (patch: Partial<DeliveryAddressFields>) => {
    setAddressFields((prev) => ({ ...prev, ...patch }))
  }

  const buildEnquiryFormData = (): CartEnquiryFormData | null => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'error')
      return null
    }

    if (!customerName.trim()) {
      showToast('Please enter your name', 'error')
      return null
    }

    if (!validatePhone(customerPhone)) {
      showToast('Please enter a valid phone number', 'error')
      return null
    }

    const addressError = validateDeliveryAddress(addressFields)
    if (addressError) {
      showToast(addressError, 'error')
      return null
    }

    const normalizedReferral = referralCode.trim() ? normalizeReferralCode(referralCode) : ''
    const allowedReferralCodes = settings.social_links.referral_codes ?? []
    if (
      normalizedReferral &&
      !isReferralCodeValid(normalizedReferral, allowedReferralCodes)
    ) {
      showToast('Invalid referral code. Please check and try again.', 'error')
      return null
    }

    return {
      items,
      customerName: customerName.trim(),
      customerPhone,
      customerAddress: buildFullDeliveryAddress(addressFields),
      customerMessage,
      customerEmail,
      referralCode: normalizedReferral || undefined,
      authUserId: isCustomer && user?.id ? user.id : undefined,
      spinReward: spinReward
        ? {
            label: spinReward.label,
            discountAmount: spinDiscount > 0 ? spinDiscount : undefined,
          }
        : undefined,
    }
  }

  const handleUseCurrentLocation = async () => {
    setLocating(true)
    try {
      const locationSnapshot = await getCurrentDeliveryAddress()
      updateAddress({ locationSnapshot })
      showToast('Area detected — add door no. and street below', 'success')
    } catch (error) {
      showToast(geolocationErrorMessage(error), 'error')
    } finally {
      setLocating(false)
    }
  }

  const handleSendEnquiry = async () => {
    const formData = buildEnquiryFormData()
    if (!formData) return

    if (!settings.whatsapp_number) {
      showToast('WhatsApp contact is not configured. Please call us instead.', 'error')
      return
    }

    setLoading(true)

    try {
      const { error } = await createCartEnquiry(formData)

      if (error) {
        showToast(`Could not save enquiry: ${error}`, 'error')
        return
      }

      showToast('Enquiry saved! Opening WhatsApp…', 'success')

      const message = buildCartWhatsAppMessage(formData)
      const url = buildWhatsAppUrl(settings.whatsapp_number, message)
      window.open(url, '_blank', 'noopener,noreferrer')
      clearCart()
      resetSpinForNewEnquiry()
      setCustomerName('')
      setCustomerPhone('')
      setAddressFields(emptyAddressFields())
      setCustomerMessage('')
      setReferralCode('')
      setPrefilledFromAccount(false)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formProps = {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    addressFields,
    updateAddress,
    customerMessage,
    setCustomerMessage,
    referralCode,
    setReferralCode,
    locating,
    loading,
    isLoggedIn: Boolean(isCustomer && user),
    customerEmail,
    settings,
    itemCount: items.length,
    estimatedTotal: estimatedAfterSpin,
    hasPricedItems,
    spinReward,
    onUseLocation: handleUseCurrentLocation,
    onSendEnquiry: handleSendEnquiry,
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

        <CartLikesPageShell>
        <div className="bg-white">
          <CartLikesHero>
              <nav className={cartLikesHeroBreadcrumbClass}>
                <Link to="/" className="transition hover:text-white">Home</Link>
                <span>/</span>
                <span className={cartLikesHeroBreadcrumbCurrentClass}>Cart</span>
              </nav>
              <h1 className={cn('mt-4', cartLikesHeroTitleClass)}>
                Your cart is <span className={cartLikesHeroAccentClass}>empty</span>
              </h1>
          </CartLikesHero>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <AnimateIn animation="fade-up">
              <div className="relative overflow-hidden rounded-3xl border border-[#0F2847]/10 bg-white px-6 py-14 text-center shadow-lg sm:px-12">
                <div className="relative mx-auto max-w-md">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0F2847] shadow-xl">
                    <ShoppingBag className="h-11 w-11 text-white" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-extrabold text-[#0F2847]">Start your celebration list</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#0F2847]/70">
                    Pick crackers from our catalogue, then send one WhatsApp enquiry with everything in your cart.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2847] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#1A3D66]"
                    >
                      <Package className="h-4 w-4" />
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/gift-box"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0F2847] px-6 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#0F2847] transition hover:bg-[#0F2847]/5"
                    >
                      <Gift className="h-4 w-4" />
                      Gift box
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
        </CartLikesPageShell>
      </>
    )
  }

  return (
    <>
      <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

      <CartLikesPageShell>
      <div className="bg-white pb-28 sm:pb-10">
        <CartHero itemCount={items.length} totalUnits={totalUnits} />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Products', value: String(items.length), icon: Package },
              { label: 'Total qty', value: String(totalUnits), icon: ClipboardList },
              {
                label: 'Est. value',
                value: hasPricedItems ? formatPrice(estimatedAfterSpin) : 'On request',
                icon: Sparkles,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#0F2847]/10 bg-white px-3 py-3 text-center shadow-sm sm:px-4 sm:py-4"
              >
                <stat.icon className="mx-auto h-4 w-4 text-[#0077B6]" />
                <p className="mt-1 font-display text-lg font-extrabold tabular-nums text-[#0F2847] sm:text-xl">
                  {stat.value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="space-y-5 lg:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-extrabold uppercase tracking-wide text-[#0F2847]">
                  Your selection
                </h2>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1 rounded-full bg-[#0F2847]/10 px-3 py-1.5 text-xs font-bold text-[#0F2847] transition hover:bg-[#0077B6]/30"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add more
                </Link>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    index={index}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <AnimateIn animation="fade-up" delay={120}>
                <SpinToWinWheel
                  estimatedTotal={estimatedTotal}
                  reward={spinReward}
                  onRewardChange={handleSpinRewardChange}
                />
              </AnimateIn>

              <AnimateIn animation="fade-up" delay={160}>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: ShieldCheck, text: 'No online payment', readWhy: true },
                    { icon: MessageCircle, text: '24/7 WhatsApp support' },
                    { icon: Truck, text: 'All-India delivery' },
                  ].map(({ icon: Icon, text, readWhy }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 rounded-xl border border-[#0F2847]/10 bg-white px-3 py-2.5 text-xs font-semibold text-[#0F2847]"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-[#0077B6]" />
                      <span className="min-w-0">
                        {text}
                        {readWhy && (
                          <>
                            {' · '}
                            <Link
                              to={PAYMENT_POLICY_PATH}
                              className="font-bold text-[#0077B6] underline decoration-[#0077B6]/60 underline-offset-2 hover:text-[#0F2847]"
                            >
                              Read why
                            </Link>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </AnimateIn>
            </div>

            <div className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-24">
                <EnquiryForm {...formProps} />
              </div>
            </div>
          </div>

          <div className="mt-8 lg:hidden">
            <EnquiryForm {...formProps} />
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0F2847]/10 bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,77,85,0.15)] backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {items.length} items ready
              </p>
              {hasPricedItems ? (
                <p className="text-lg font-extrabold tabular-nums text-[#0F2847]">{formatPrice(estimatedAfterSpin)}</p>
              ) : (
                <p className="text-sm font-semibold text-[#0F2847]">Tap to send enquiry</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('send-enquiry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-extrabold text-white shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              Send Enquiry
            </button>
          </div>
        </div>
      </div>
      </CartLikesPageShell>
    </>
  )
}
