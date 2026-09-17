import { AlertTriangle } from 'lucide-react'

interface StockAlertModalProps {
  alerts: { id?: string; name: string; remaining: number; limit: number }[]
  onClose: () => void
}

export function StockAlertModal({ alerts, onClose }: StockAlertModalProps) {
  if (alerts.length === 0) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900">Low stock alert</h3>
            <p className="mt-1 text-sm text-slate-600">
              {alerts.length === 1
                ? 'This product has reached its stock alert limit.'
                : `${alerts.length} products have reached their stock alert limit.`}
            </p>
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {alerts.map((alert, index) => (
                <li
                  key={alert.id || `${alert.name}-${alert.remaining}-${index}`}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm"
                >
                  <p className="font-medium text-navy-900">{alert.name}</p>
                  <p className="text-amber-800">
                    {alert.remaining} left — alert limit is {alert.limit}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-festive-500 px-4 py-2 text-sm font-medium text-white hover:bg-festive-400"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
