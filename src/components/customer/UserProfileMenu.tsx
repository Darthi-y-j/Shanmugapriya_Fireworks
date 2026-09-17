import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getCustomerProfile } from '@/services/enquiries'
import { cn } from '@/lib/utils'
import type { Customer } from '@/types/database'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

interface UserProfileMenuProps {
  isDarkNav: boolean
  className?: string
}

export function UserProfileMenu({ isDarkNav, className }: UserProfileMenuProps) {
  const { user, isCustomer, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<Customer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !user || !isCustomer) {
      setProfile(null)
      return
    }

    let cancelled = false
    getCustomerProfile(user.id)
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch(() => {
        if (!cancelled) setProfile(null)
      })

    return () => {
      cancelled = true
    }
  }, [open, user, isCustomer])

  const displayName =
    profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || 'Customer'
  const email = user?.email || profile?.email || ''
  const phone = profile?.phone || (user?.user_metadata?.phone as string | undefined) || ''

  const triggerClass = cn(
    'rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95',
    isDarkNav ? 'text-white hover:bg-white/10' : 'text-navy-700 hover:bg-navy-800/5',
    open && (isDarkNav ? 'bg-white/10' : 'bg-navy-900/5'),
    className,
  )

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={user && isCustomer ? 'User profile' : 'Account options'}
      >
        <User className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),16rem)] animate-fade-up overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_12px_40px_rgba(12,8,6,0.15)]"
          role="dialog"
          aria-label="User profile"
        >
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-navy-700/60">Loading…</div>
          ) : user && isCustomer ? (
            <>
              <div className="border-b border-navy-900/8 bg-gradient-to-br from-navy-950 to-navy-900 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-300 ring-1 ring-gold-400/30">
                    {getInitials(displayName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-cream-50">{displayName}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gold-400/80">
                      Customer
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 px-4 py-3">
                {email && (
                  <p className="flex items-start gap-2 text-xs text-navy-700/80">
                    <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                    <span className="break-all">{email}</span>
                  </p>
                )}
                {phone && (
                  <p className="flex items-start gap-2 text-xs text-navy-700/80">
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                    <span>{phone}</span>
                  </p>
                )}
              </div>

              <div className="border-t border-navy-900/8 p-2 space-y-1">
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-navy-800 transition hover:bg-navy-900/[0.04]"
                >
                  <Settings className="h-3.5 w-3.5" />
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    void signOut()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="p-4">
              <p className="text-center text-sm font-semibold text-navy-900">Your Account</p>
              <p className="mt-1 text-center text-xs text-navy-700/60">Sign in to view your profile</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-navy-900 py-2.5 text-center text-xs font-bold text-gold-300 transition hover:bg-navy-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gold-500/30 py-2.5 text-center text-xs font-semibold text-gold-700 transition hover:bg-gold-500/10"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
