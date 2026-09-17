import { Link } from 'react-router-dom'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { AccountPageHeader, StatCard, accountContentClass } from '@/components/customer/account/AccountUI'
import {
  getEnquiryItemCount,
  getEnquiryStatusLabel,
  useAccountProfile,
} from '@/contexts/AccountProfileContext'
import { getCustomerFacingEnquiryMessage, getEnquiryCategoryLabel } from '@/services/enquiries'
import { formatDateShort } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EnquiryStatus } from '@/types/database'

function statusColor(status: EnquiryStatus) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200/80'
    case 'cancelled':
      return 'bg-red-50 text-red-700 ring-red-200/80'
    case 'contacted':
      return 'bg-amber-50 text-amber-800 ring-amber-200/80'
    default:
      return 'bg-blue-50 text-blue-700 ring-blue-200/80'
  }
}

export function EnquiriesPage() {
  const { enquiries, enquiryStats, loading } = useAccountProfile()

  if (loading) {
    return (
      <div className="py-16">
        <LoadingState message="Loading enquiries..." />
      </div>
    )
  }

  return (
    <>
      <SEO title="My Enquiries" description="View your WhatsApp and cart enquiry history." noIndex />

      <AccountPageHeader backTo="/account" subtitle="My Enquiries" />

      <div className={`${accountContentClass} space-y-6`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={enquiryStats.total} label="Total" />
          <StatCard value={enquiryStats.new} label="New" />
          <StatCard value={enquiryStats.contacted} label="Contacted" />
          <StatCard value={enquiryStats.completed} label="Completed" />
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-900">Recent Enquiries</h2>
          {enquiries.length === 0 && (
            <p className="mt-1 text-sm text-navy-700/80">
              Enquiries sent via cart WhatsApp or the contact form appear here.
            </p>
          )}
        </div>

        {enquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white p-8 text-center">
            <p className="text-sm text-navy-700/80">No enquiries yet.</p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-lg bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-400"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {enquiries.map((enquiry) => {
              const itemCount = getEnquiryItemCount(enquiry)
              const statusLabel = getEnquiryStatusLabel(enquiry.status)
              const customerNote = getCustomerFacingEnquiryMessage(enquiry.customer_message)
              const sourceLabel =
                enquiry.enquiry_type === 'order'
                  ? 'Cart order · WhatsApp'
                  : enquiry.enquiry_type === 'cart'
                    ? 'Product · WhatsApp'
                    : enquiry.enquiry_type === 'contact'
                      ? 'Contact form'
                      : 'Account'

              return (
                <li
                  key={enquiry.id}
                  className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-navy-900">{enquiry.enquiry_number}</p>
                      <p className="mt-0.5 text-xs text-navy-700/80">{formatDateShort(enquiry.created_at)}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset',
                        statusColor(enquiry.status),
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="text-navy-800">
                      <span className="font-medium text-navy-900">Items:</span> {itemCount}
                    </p>
                    <p className="text-navy-800">
                      <span className="font-medium text-navy-900">Source:</span> {sourceLabel}
                    </p>
                    {enquiry.enquiry_category && (
                      <p className="text-navy-800 sm:col-span-2">
                        <span className="font-medium text-navy-900">Category:</span>{' '}
                        {getEnquiryCategoryLabel(enquiry.enquiry_category)}
                      </p>
                    )}
                  </div>

                  {enquiry.items?.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-navy-900/8 pt-3">
                      {enquiry.items.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-xs text-navy-800">
                          {item.quantity}× {item.product_name}
                        </li>
                      ))}
                      {enquiry.items.length > 3 && (
                        <li className="text-xs text-navy-700/75">+{enquiry.items.length - 3} more items</li>
                      )}
                    </ul>
                  )}

                  {customerNote && (
                    <p className="mt-3 line-clamp-2 text-xs text-navy-800">{customerNote}</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
