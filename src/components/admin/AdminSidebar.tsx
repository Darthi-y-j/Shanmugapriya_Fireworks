import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  MessageSquare,
  Mail,
  Users,
  Settings,
  LogOut,
  X,
  ShoppingBag,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/orders', label: 'Order Enquiries', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { signOut, user } = useAuth()

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[17.5rem] flex-col border-r border-white/5 bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900 text-white shadow-2xl transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245,158,11,0.12),transparent_60%)]"
          aria-hidden
        />

        <div className="relative flex h-[4.25rem] items-center justify-between border-b border-white/8 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={SITE_LOGO_PATH}
              alt={SHANMUGA_BRAND.displayName}
              className="h-10 w-10 shrink-0 rounded-full border border-gold-400/30 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold leading-tight text-white">
                {SHANMUGA_BRAND.displayName}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold-300/70">
                Control Panel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 to-festive-500/10 text-gold-300 shadow-inner shadow-gold-500/5 ring-1 ring-gold-400/20'
                    : 'text-white/55 hover:bg-white/5 hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                      isActive ? 'bg-gold-500/20 text-gold-300' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white/80',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative border-t border-white/8 p-4">
          {user?.email && (
            <div className="mb-3 truncate rounded-xl bg-white/5 px-3 py-2 text-xs text-white/50">
              {user.email}
            </div>
          )}
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
