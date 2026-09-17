import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastActions {
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastActionsContext = createContext<ToastActions | undefined>(undefined)
const ToastStateContext = createContext<Toast[]>([])

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const actions = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast],
  )

  return (
    <ToastActionsContext.Provider value={actions}>
      <ToastStateContext.Provider value={toasts}>{children}</ToastStateContext.Provider>
    </ToastActionsContext.Provider>
  )
}

/** Stable actions only — safe inside product cards (no re-render on toast show/hide). */
export function useToast() {
  const context = useContext(ToastActionsContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function useToastList() {
  return useContext(ToastStateContext)
}
