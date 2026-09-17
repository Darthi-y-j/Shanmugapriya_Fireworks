import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Copy, Mail, Trash2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteNewsletterSubscriber, getNewsletterSubscribers } from '@/services/newsletter'
import { useToast } from '@/contexts/ToastContext'
import { getSupabaseErrorMessage } from '@/lib/supabase'
import { formatDateShort } from '@/lib/utils'
import type { NewsletterSubscriber } from '@/types/database'

const sourceLabels: Record<NewsletterSubscriber['source'], string> = {
  footer: 'Footer',
  home: 'Homepage',
}

export function AdminNewsletterPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const { showToast } = useToast()
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getNewsletterSubscribers()
      setSubscribers(data)
    } catch (error) {
      showToast(getSupabaseErrorMessage(error), 'error')
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    void loadSubscribers()
  }, [loadSubscribers])

  const emailList = useMemo(() => subscribers.map((row) => row.email).join('\n'), [subscribers])

  const handleCopyAll = async () => {
    if (!emailList) {
      showToast('No subscriber emails to copy', 'error')
      return
    }
    try {
      await navigator.clipboard.writeText(emailList)
      showToast('Copied all subscriber emails', 'success')
    } catch {
      showToast('Could not copy emails', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteNewsletterSubscriber(deleteTarget.id)
      setSubscribers((rows) => rows.filter((row) => row.id !== deleteTarget.id))
      showToast('Subscriber removed', 'success')
      setDeleteTarget(null)
    } catch (error) {
      showToast(getSupabaseErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader title="Newsletter" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Emails collected from the footer and homepage newsletter forms.
          </p>
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={subscribers.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy all emails
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Source</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Subscribed</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading…</td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      <Mail className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                      No subscribers yet. They will appear here when visitors sign up on the site.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{subscriber.email}</td>
                      <td className="px-4 py-3 text-slate-700">{sourceLabels[subscriber.source]}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDateShort(subscriber.subscribed_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(subscriber)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove subscriber?"
        message={
          deleteTarget
            ? `Remove ${deleteTarget.email} from the newsletter list?`
            : ''
        }
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  )
}
