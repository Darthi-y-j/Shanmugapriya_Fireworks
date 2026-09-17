import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext, useLocation } from 'react-router-dom'
import {
  MessageCircle,
  Trash2,
  Mail,
  Phone,
  User,
  Clock,
  Inbox,
  Package,
  FileDown,
} from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { LinkifiedText } from '@/components/shared/LinkifiedText'
import { EnquiryReplyButton, EnquiryUndoReplyButton } from '@/components/admin/EnquiryReplyButton'
import {
  getEnquiries,
  updateEnquiryStatus,
  updateEnquiryReplied,
  deleteEnquiry,
  getEnquiryTypeLabel,
  getEnquiryCategoryLabel,
  resolveEnquiryType,
  isEnquiryReplied,
  isOrderEnquiry,
  isGeneralEnquiry,
  parseEnquiryMessage,
  getEnquiryReferralCode,
} from '@/services/enquiries'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { getSupabaseErrorMessage } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { useStockAlerts } from '@/contexts/StockAlertContext'
import { applyEnquiryStockChange } from '@/services/products'
import { getEnquiryStockItems } from '@/lib/stock'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { downloadEnquiryPdf } from '@/lib/cartEnquiryPdf'
import { formatDisplayPhone } from '@/lib/businessInfo'
import { formatDate, formatDateShort, cn } from '@/lib/utils'
import type { Enquiry, EnquiryStatus } from '@/types/database'

const typeStyles = {
  cart: 'bg-blue-50 text-blue-700 ring-blue-200',
  order: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  contact: 'bg-amber-50 text-amber-800 ring-amber-200',
  account: 'bg-violet-50 text-violet-700 ring-violet-200',
} as const

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

type EnquiryInboxMode = 'general' | 'order'

const inboxConfig = {
  general: {
    title: 'Enquiries',
    emptyMessage: 'No general enquiries found',
    emptyHint: 'Contact form and single-product enquiries appear here',
    matches: isGeneralEnquiry,
  },
  order: {
    title: 'Order Enquiries',
    emptyMessage: 'No order enquiries found',
    emptyHint: 'Cart orders with multiple items appear here',
    matches: isOrderEnquiry,
  },
} as const

function AdminEnquiryInbox({ mode }: { mode: EnquiryInboxMode }) {
  const config = inboxConfig[mode]
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const location = useLocation()
  const enquiryIdFromNav = (location.state as { enquiryId?: string } | null)?.enquiryId
  const { isAdmin } = useAuth()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const { showStockAlerts } = useStockAlerts()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all')
  const [repliedFilter, setRepliedFilter] = useState<'all' | 'pending' | 'replied'>('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingReplyId, setTogglingReplyId] = useState<string | null>(null)
  const [pdfDownloading, setPdfDownloading] = useState(false)

  const loadEnquiries = useCallback(async () => {
    setLoading(true)
    try {
      if (!isAdmin) {
        setEnquiries([])
        return
      }
      const data = await getEnquiries(statusFilter === 'all' ? undefined : statusFilter)
      setEnquiries(data)
    } catch (error) {
      setEnquiries([])
      showToast(`Could not load enquiries: ${getSupabaseErrorMessage(error)}`, 'error')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, showToast, statusFilter])

  useEffect(() => {
    loadEnquiries()
  }, [loadEnquiries])

  useEffect(() => {
    if (!isAdmin) {
      showToast('Log in as admin to view enquiries.', 'error')
    }
  }, [isAdmin, showToast])

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    const previous = enquiries.find((enquiry) => enquiry.id === id) ?? selectedEnquiry
    const { error } = await updateEnquiryStatus(id, status)
    if (error) {
      showToast(error, 'error')
      return
    }

    showToast('Status updated', 'success')
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    setSelectedEnquiry((prev) => (prev?.id === id ? { ...prev, status } : prev))

    if (!previous) return

    const items = getEnquiryStockItems(previous)
    if (items.length === 0) return

    if (previous.status !== 'completed' && status === 'completed') {
      const results = await applyEnquiryStockChange(items, 'sold')
      const failed = results.find((result) => result.error)
      if (failed?.error) {
        showToast(failed.error, 'error')
        return
      }
      showStockAlerts(results)
      const deducted = results.filter((result) => result.remaining != null)
      if (deducted.length > 0) {
        showToast('Stock updated for sold items', 'success')
      }
    }

    if (previous.status === 'completed' && status !== 'completed') {
      const results = await applyEnquiryStockChange(items, 'restore')
      const failed = results.find((result) => result.error)
      if (failed?.error) {
        showToast(failed.error, 'error')
        return
      }
      showStockAlerts(results)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await deleteEnquiry(deleteId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Enquiry deleted', 'success')
      setSelectedEnquiry(null)
      loadEnquiries()
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const handleDownloadPdf = async (enquiry: Enquiry) => {
    setPdfDownloading(true)
    try {
      await downloadEnquiryPdf(enquiry, {
        businessName: settings.business_name,
        businessPhone: settings.whatsapp_number
          ? formatDisplayPhone(settings.whatsapp_number)
          : undefined,
      })
      showToast('Order PDF downloaded', 'success')
    } catch {
      showToast('Could not generate PDF. Please try again.', 'error')
    } finally {
      setPdfDownloading(false)
    }
  }

  const contactWhatsApp = (enquiry: Enquiry) => {
    if (!settings.whatsapp_number) return
    const type = resolveEnquiryType(enquiry)
    const subject =
      type === 'cart' || type === 'order'
        ? `your enquiry ${enquiry.enquiry_number} for ${enquiry.product_name}`
        : `your enquiry ${enquiry.enquiry_number}`
    const message = `Hi ${enquiry.customer_name}, regarding ${subject}.`
    const url = buildWhatsAppContactUrl(enquiry.customer_phone, message)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleToggleReplied = async (enquiry: Enquiry, replied: boolean) => {
    setTogglingReplyId(enquiry.id)
    const { error, status, admin_replied, replied_at } = await updateEnquiryReplied(
      enquiry.id,
      replied,
      enquiry.status,
    )
    setTogglingReplyId(null)

    if (error) {
      showToast(error, 'error')
      return
    }

    const patch = {
      admin_replied: admin_replied ?? replied,
      replied_at: replied_at ?? (replied ? new Date().toISOString() : null),
      ...(status ? { status } : {}),
    }

    setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, ...patch } : e)))
    setSelectedEnquiry((prev) => (prev?.id === enquiry.id ? { ...prev, ...patch } : prev))
    showToast(replied ? 'Marked as replied' : 'Marked as pending', 'success')
  }

  const modeEnquiries = useMemo(
    () => enquiries.filter(config.matches),
    [enquiries, config],
  )

  const filteredEnquiries = modeEnquiries.filter((enquiry) => {
    if (repliedFilter === 'pending') return !isEnquiryReplied(enquiry)
    if (repliedFilter === 'replied') return isEnquiryReplied(enquiry)
    return true
  })

  useEffect(() => {
    if (loading) return

    setSelectedEnquiry((current) => {
      if (filteredEnquiries.length === 0) return null

      if (enquiryIdFromNav) {
        const fromNav = filteredEnquiries.find((e) => e.id === enquiryIdFromNav)
        if (fromNav) return fromNav
      }

      if (current) {
        const updated = filteredEnquiries.find((e) => e.id === current.id)
        if (updated) return updated
      }

      return filteredEnquiries[0]
    })
  }, [loading, filteredEnquiries, repliedFilter, enquiryIdFromNav])

  const pendingCount = modeEnquiries.filter((e) => !isEnquiryReplied(e)).length

  const getEnquirySummary = (enquiry: Enquiry) => {
    const type = resolveEnquiryType(enquiry)
    if (type === 'cart' || type === 'order') {
      if (enquiry.items && enquiry.items.length > 0) {
        return enquiry.items.map((item) => item.product_name).join(', ')
      }
      return enquiry.product_name
    }
    return getEnquiryCategoryLabel(enquiry.enquiry_category) !== 'General Enquiry'
      ? getEnquiryCategoryLabel(enquiry.enquiry_category)
      : enquiry.product_name.replace(/^\[(Contact|Account)\]\s*/, '')
  }

  const getMessagePreview = (enquiry: Enquiry) => {
    const parsed = parseEnquiryMessage(enquiry.customer_message)
    return parsed.body || getEnquirySummary(enquiry)
  }

  const filterTabs: { id: typeof repliedFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: modeEnquiries.length },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'replied', label: 'Replied', count: modeEnquiries.length - pendingCount },
  ]

  const selectedType = selectedEnquiry ? resolveEnquiryType(selectedEnquiry) : null
  const selectedParsed = selectedEnquiry ? parseEnquiryMessage(selectedEnquiry.customer_message) : null
  const selectedEmail = selectedEnquiry?.customer_email || selectedParsed?.email || null
  const selectedReferralCode = selectedEnquiry ? getEnquiryReferralCode(selectedEnquiry) : null
  const selectedMessageBody = selectedParsed?.body || selectedEnquiry?.customer_message || ''

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AdminHeader title={config.title} onMenuClick={onMenuClick} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-navy-900/8 bg-white p-1 shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRepliedFilter(tab.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                  repliedFilter === tab.id
                    ? 'bg-gradient-to-r from-navy-900 to-navy-800 text-gold-300 shadow-sm'
                    : 'text-navy-700/70 hover:bg-cream-50',
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn('ml-1.5 tabular-nums', repliedFilter === tab.id ? 'text-gold-300/80' : 'text-navy-700/40')}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | 'all')}
              className="admin-input"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="button"
              onClick={() => loadEnquiries()}
              className="admin-input whitespace-nowrap px-3 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          {/* Inbox list */}
          <section className="admin-card flex max-h-[420px] flex-col overflow-hidden lg:max-h-none lg:w-[340px] lg:shrink-0 xl:w-[380px]">
            <div className="flex items-center gap-2 border-b border-navy-900/8 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500/15 to-festive-500/10">
                <Inbox className="h-4 w-4 text-festive-600" />
              </div>
              <span className="font-display text-sm font-bold text-navy-900">Inbox</span>
              <span className="ml-auto rounded-full bg-navy-900/5 px-2 py-0.5 text-xs font-medium text-navy-700/55">
                {filteredEnquiries.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-sm text-slate-500">Loading...</div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <Inbox className="mb-3 h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">{config.emptyMessage}</p>
                  <p className="mt-1 text-xs text-slate-500">{config.emptyHint}</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enquiry) => {
                    const replied = isEnquiryReplied(enquiry)
                    const type = resolveEnquiryType(enquiry)
                    const isSelected = selectedEnquiry?.id === enquiry.id

                    return (
                      <li key={enquiry.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className={cn(
                            'relative w-full px-4 py-3.5 text-left transition',
                            isSelected ? 'bg-gradient-to-r from-gold-500/10 to-festive-500/5' : 'hover:bg-cream-50/80',
                          )}
                        >
                          {isSelected && (
                            <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-gradient-to-b from-gold-400 to-festive-500" aria-hidden />
                          )}

                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                isSelected ? 'bg-festive-500 text-white' : 'bg-slate-100 text-slate-600',
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
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-festive-500" title="Pending reply" />
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                                {getEnquirySummary(enquiry)}
                              </p>
                              <p className="mt-1 line-clamp-1 text-xs text-slate-500">{getMessagePreview(enquiry)}</p>
                              {getEnquiryReferralCode(enquiry) && (
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-violet-600">
                                  Ref: {getEnquiryReferralCode(enquiry)}
                                </p>
                              )}
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset', typeStyles[type])}>
                                  {getEnquiryTypeLabel(enquiry.enquiry_type, enquiry.product_name)}
                                </span>
                                <StatusBadge status={enquiry.status} />
                                <span className="text-[10px] text-slate-400">{formatDateShort(enquiry.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* Detail panel */}
          <section className="admin-card flex min-h-[22rem] flex-1 flex-col overflow-hidden lg:min-h-0">
            {!selectedEnquiry ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                <MessageCircle className="mb-3 h-12 w-12 text-slate-300" />
                <p className="text-sm font-medium text-slate-700">Select an enquiry</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">Choose a message from the inbox to view details and reply</p>
              </div>
            ) : (
              <>
                <div className="shrink-0 border-b border-navy-900/8 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600/80">Enquiry</p>
                      <h2 className="mt-1 font-mono text-lg font-bold text-navy-900">{selectedEnquiry.enquiry_number}</h2>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {selectedType && (
                          <span className={cn('rounded-lg px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', typeStyles[selectedType])}>
                            {getEnquiryTypeLabel(selectedEnquiry.enquiry_type, selectedEnquiry.product_name)}
                          </span>
                        )}
                        <StatusBadge status={selectedEnquiry.status} />
                        {isEnquiryReplied(selectedEnquiry) && (
                          <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            Replied
                          </span>
                        )}
                      </div>
                    </div>

                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) =>
                        handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)
                      }
                      className="admin-input font-medium"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-navy-900/8 bg-cream-50/80 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <User className="h-3.5 w-3.5" />
                        Customer
                      </div>
                      <p className="mt-2 text-base font-semibold text-slate-900">{selectedEnquiry.customer_name}</p>
                      <div className="mt-3 space-y-2">
                        <a
                          href={`tel:${selectedEnquiry.customer_phone}`}
                          className="flex items-center gap-2 text-sm text-slate-700 hover:text-festive-600"
                        >
                          <Phone className="h-4 w-4 text-slate-400" />
                          {selectedEnquiry.customer_phone}
                        </a>
                        {selectedEmail && (
                          <a
                            href={`mailto:${selectedEmail}`}
                            className="flex items-center gap-2 break-all text-sm text-slate-700 hover:text-festive-600"
                          >
                            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                            {selectedEmail}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-navy-900/8 bg-cream-50/80 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        Details
                      </div>
                      <dl className="mt-2 space-y-2 text-sm">
                        <div>
                          <dt className="text-slate-500">Received</dt>
                          <dd className="font-medium text-slate-900">{formatDate(selectedEnquiry.created_at)}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">{selectedType === 'cart' || selectedType === 'order' ? 'Products' : 'Subject'}</dt>
                          <dd className="font-medium text-slate-900">{getEnquirySummary(selectedEnquiry)}</dd>
                        </div>
                        {(selectedType === 'cart' || selectedType === 'order') && (
                          <div>
                            <dt className="text-slate-500">Quantity</dt>
                            <dd className="font-medium text-slate-900">{selectedEnquiry.quantity}</dd>
                          </div>
                        )}
                        {selectedReferralCode && (
                          <div>
                            <dt className="text-slate-500">Referral code</dt>
                            <dd className="font-mono font-bold text-violet-700">{selectedReferralCode}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {(selectedType === 'cart' || selectedType === 'order') && selectedEnquiry.items && selectedEnquiry.items.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <Package className="h-3.5 w-3.5" />
                        Order items
                      </div>
                      <ul className="space-y-2">
                        {selectedEnquiry.items.map((item, i) => (
                          <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                            <span className="font-medium text-slate-800">{item.product_name}</span>
                            <span className="text-slate-500">× {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMessageBody && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
                      <blockquote className="rounded-xl border border-navy-900/8 bg-cream-50 px-4 py-4 text-sm leading-relaxed text-navy-800">
                        <LinkifiedText text={selectedMessageBody} />
                      </blockquote>
                    </div>
                  )}

                  {isEnquiryReplied(selectedEnquiry) && selectedEnquiry.replied_at && (
                    <p className="mt-3 text-xs text-slate-500">
                      Marked as replied on {formatDate(selectedEnquiry.replied_at)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 border-t border-navy-900/8 bg-cream-50/50 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => contactWhatsApp(selectedEnquiry)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20bd5a]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Reply on WhatsApp
                    </button>
                    <EnquiryReplyButton
                      replied={isEnquiryReplied(selectedEnquiry)}
                      disabled={togglingReplyId === selectedEnquiry.id}
                      fullWidth
                      onToggle={(checked) => handleToggleReplied(selectedEnquiry, checked)}
                    />
                  </div>

                  {(selectedType === 'cart' || selectedType === 'order') && (
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(selectedEnquiry)}
                      disabled={pdfDownloading}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-sm font-semibold text-navy-900 transition hover:border-gold-400 hover:bg-gold-50/50 disabled:opacity-60"
                    >
                      {pdfDownloading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      ) : (
                        <FileDown className="h-4 w-4 text-gold-600" />
                      )}
                      Download Order PDF
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    {isEnquiryReplied(selectedEnquiry) ? (
                      <EnquiryUndoReplyButton
                        disabled={togglingReplyId === selectedEnquiry.id}
                        onClick={() => handleToggleReplied(selectedEnquiry, false)}
                      />
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteId(selectedEnquiry.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export function AdminEnquiriesPage() {
  return <AdminEnquiryInbox mode="general" />
}

export function AdminOrderEnquiriesPage() {
  return <AdminEnquiryInbox mode="order" />
}
