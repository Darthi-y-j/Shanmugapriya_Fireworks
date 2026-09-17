import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useStockAlerts } from '@/contexts/StockAlertContext'

interface AdminHeaderProps {
  title: string
  onMenuClick: () => void
}

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase()
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { user } = useAuth()
  const { lowStockProducts } = useStockAlerts()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const alertCount = lowStockProducts.length

  useEffect(() => {
    if (!open) return
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <header className="sticky top-0 z-20 flex h-[4.25rem] shrink-0 items-center justify-between border-b border-navy-900/8 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-navy-900/8 bg-white p-2 text-navy-700 shadow-sm transition hover:bg-cream-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600/80">Admin</p>
          <h2 className="font-display text-xl font-bold leading-tight text-navy-900">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative rounded-xl border border-navy-900/8 bg-white p-2 text-navy-600 shadow-sm transition hover:bg-cream-50"
            aria-label="Stock notifications"
            aria-expanded={open}
          >
            <Bell className="h-5 w-5" />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-festive-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {alertCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-navy-900/8 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-sm font-semibold text-navy-900">Low stock</p>
                <p className="text-xs text-slate-500">Products at or below their alert limit</p>
              </div>
              {alertCount === 0 ? (
                <p className="px-3 py-4 text-sm text-slate-500">No low-stock products.</p>
              ) : (
                <ul className="max-h-80 overflow-auto py-1">
                  {lowStockProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 hover:bg-cream-50"
                      >
                        <p className="truncate text-sm font-medium text-navy-900">{product.name}</p>
                        <p className="text-xs text-amber-700">
                          {product.stock_quantity} left · limit {product.stock_alert_limit}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="max-w-[180px] truncate text-sm font-semibold text-navy-900">{user?.email}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-navy-700/50">Administrator</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-festive-500 text-xs font-bold text-navy-950 shadow-md shadow-festive-500/20">
            {user?.email ? getInitials(user.email) : 'AD'}
          </div>
        </div>
      </div>
    </header>
  )
}
