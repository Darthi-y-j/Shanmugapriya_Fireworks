import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToast, useToastList } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const toasts = useToastList()
  const { removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-[5.25rem] left-3 right-3 z-[100] flex flex-col items-center gap-2 sm:bottom-4 sm:left-auto sm:right-4 sm:items-end">
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className={cn(
            'animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg px-3 py-2 shadow-lg sm:max-w-xs sm:items-center sm:gap-2.5 sm:px-3.5 sm:py-2.5',
            toast.type === 'success' && 'bg-green-600 text-white',
            toast.type === 'error' && 'bg-red-600 text-white',
            toast.type === 'info' && 'bg-navy-900 text-white',
          )}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {toast.type === 'success' && <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-4 sm:w-4" />}
          {toast.type === 'error' && <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-4 sm:w-4" />}
          {toast.type === 'info' && <Info className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0 sm:h-4 sm:w-4" />}
          <span className="min-w-0 flex-1 text-xs leading-snug sm:text-sm sm:leading-normal">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="-mr-0.5 shrink-0 p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
