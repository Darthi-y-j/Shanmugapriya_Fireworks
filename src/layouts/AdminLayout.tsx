import { Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StockAlertProvider, useStockAlerts } from '@/contexts/StockAlertContext'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { StockAlertModal } from '@/components/admin/StockAlertModal'
import { ToastContainer } from '@/components/customer/Toast'

function AdminStockAlerts() {
  const { popupAlerts, dismissPopup } = useStockAlerts()
  return <StockAlertModal alerts={popupAlerts} onClose={dismissPopup} />
}

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-festive-500 border-t-transparent" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <StockAlertProvider>
      <div className="admin-shell flex h-screen overflow-hidden">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
        </div>
        <ToastContainer />
        <AdminStockAlerts />
      </div>
    </StockAlertProvider>
  )
}
