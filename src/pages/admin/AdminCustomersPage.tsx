import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { getCustomers, type CustomerWithStats } from '@/services/customers'
import { formatDateShort } from '@/lib/utils'

export function AdminCustomersPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const [customers, setCustomers] = useState<CustomerWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch {
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <AdminHeader title="Customers" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <p className="mb-4 text-sm text-slate-600">
          Customer information collected from enquiries. No customer accounts required.
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Enquiries</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Last Enquiry</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Recent Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No customer data yet. Customers appear when enquiries are submitted.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{customer.full_name}</td>
                      <td className="px-4 py-3 text-slate-700">{customer.phone}</td>
                      <td className="px-4 py-3 text-slate-700">{customer.enquiry_count}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {customer.last_enquiry_at
                          ? formatDateShort(customer.last_enquiry_at)
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {customer.recent_products.length > 0
                          ? customer.recent_products.join(', ')
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
