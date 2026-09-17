import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  Package,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  BarChart3,
  ChevronRight,
  Inbox,
  AlertTriangle,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DashboardCard } from '@/components/admin/DashboardCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import {
  getDashboardStats,
  getRecentEnquiries,
  isEnquiryReplied,
  getEnquiryTypeLabel,
  resolveEnquiryType,
  isOrderEnquiry,
  parseEnquiryMessage,
} from '@/services/enquiries'
import { formatDateShort, cn } from '@/lib/utils'
import { useStockAlerts } from '@/contexts/StockAlertContext'
import type { DashboardStats, Enquiry } from '@/types/database'

const typeStyles = {
  cart: 'bg-blue-50 text-blue-700 ring-blue-200',
  order: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  contact: 'bg-amber-50 text-amber-800 ring-amber-200',
  account: 'bg-violet-50 text-violet-700 ring-violet-200',
} as const

function getEnquiryAdminPath(enquiry: Enquiry): string {
  return isOrderEnquiry(enquiry) ? '/admin/orders' : '/admin/enquiries'
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

function getSubjectLine(enquiry: Enquiry): string {
  const type = resolveEnquiryType(enquiry)
  if (type === 'contact' || type === 'account') {
    return enquiry.product_name.replace(/^\[(Contact|Account)\]\s*/, '')
  }
  return enquiry.product_name
}

function getPreview(enquiry: Enquiry): string {
  const parsed = parseEnquiryMessage(enquiry.customer_message)
  return parsed.body || getSubjectLine(enquiry)
}

export function AdminDashboardPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const { lowStockProducts } = useStockAlerts()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsData, enquiries] = await Promise.all([
          getDashboardStats(),
          getRecentEnquiries(8),
        ])
        setStats(statsData)
        setRecentEnquiries(enquiries)
      } catch {
        // empty states
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const pendingCount = recentEnquiries.filter((e) => !isEnquiryReplied(e)).length

  return (
    <>
      <AdminHeader title="Dashboard" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-festive-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              <DashboardCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} accent="blue" />
              <DashboardCard title="Active Products" value={stats?.activeProducts ?? 0} icon={TrendingUp} accent="green" />
              <DashboardCard title="Categories" value={stats?.categories ?? 0} icon={FolderOpen} accent="violet" />
              <Link to="/admin/enquiries" className="block transition hover:scale-[1.01]">
                <DashboardCard title="New Enquiries" value={stats?.newEnquiries ?? 0} icon={MessageSquare} accent="festive" className="h-full" />
              </Link>
              <Link to="/admin/orders" className="block transition hover:scale-[1.01]">
                <DashboardCard title="Today's Enquiries" value={stats?.todayEnquiries ?? 0} icon={Clock} accent="gold" className="h-full" />
              </Link>
              <Link to="/admin/enquiries" className="block transition hover:scale-[1.01]">
                <DashboardCard title="Total Enquiries" value={stats?.totalEnquiries ?? 0} icon={BarChart3} accent="default" className="h-full" />
              </Link>
              <Link to="/admin/products" className="block transition hover:scale-[1.01]">
                <DashboardCard title="Low Stock Alerts" value={lowStockProducts.length} icon={AlertTriangle} accent="festive" className="h-full" />
              </Link>
            </div>

            <section className="admin-card mt-8 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/8 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500/15 to-festive-500/10">
                    <Inbox className="h-4 w-4 text-festive-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-navy-900">Recent Enquiries</h3>
                    {pendingCount > 0 && (
                      <p className="text-xs font-medium text-festive-600">{pendingCount} pending reply</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/admin/enquiries" className="admin-btn-primary px-3 py-2 text-xs sm:text-sm">
                    General enquiries
                  </Link>
                  <Link to="/admin/orders" className="admin-btn-secondary px-3 py-2 text-xs sm:text-sm">
                    Order enquiries
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {recentEnquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <Inbox className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">No enquiries yet</p>
                  <p className="mt-1 text-xs text-slate-500">New customer messages will appear here</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recentEnquiries.map((enquiry) => {
                    const replied = isEnquiryReplied(enquiry)
                    const type = resolveEnquiryType(enquiry)

                    return (
                      <li key={enquiry.id}>
                        <Link
                          to={getEnquiryAdminPath(enquiry)}
                          state={{ enquiryId: enquiry.id }}
                          className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-cream-50/80"
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                              replied ? 'bg-slate-100 text-slate-500' : 'bg-festive-100 text-festive-700',
                            )}
                          >
                            {getInitials(enquiry.customer_name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn('truncate text-sm font-semibold', replied ? 'text-slate-600' : 'text-slate-900')}>
                                {enquiry.customer_name}
                              </p>
                              {!replied && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-festive-500" />
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                              {getSubjectLine(enquiry)}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{getPreview(enquiry)}</p>
                          </div>

                          <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset', typeStyles[type])}>
                                {getEnquiryTypeLabel(enquiry.enquiry_type, enquiry.product_name)}
                              </span>
                              <StatusBadge status={enquiry.status} />
                              {replied && (
                                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                  Replied
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">{formatDateShort(enquiry.created_at)}</span>
                          </div>

                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  )
}
