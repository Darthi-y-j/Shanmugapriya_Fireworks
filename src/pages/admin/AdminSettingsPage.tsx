import { useOutletContext } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { SettingsForm } from '@/components/admin/SettingsForm'

export function AdminSettingsPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()

  return (
    <>
      <AdminHeader title="Website Settings" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SettingsForm />
        </div>
      </div>
    </>
  )
}
