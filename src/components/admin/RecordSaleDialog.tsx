import { useState } from 'react'

interface RecordSaleDialogProps {
  open: boolean
  productName: string
  remaining: number | null
  onConfirm: (quantity: number) => void
  onCancel: () => void
  loading?: boolean
}

export function RecordSaleDialog({
  open,
  productName,
  remaining,
  onConfirm,
  onCancel,
  loading,
}: RecordSaleDialogProps) {
  const [quantity, setQuantity] = useState('1')

  if (!open) return null

  const parsed = parseInt(quantity, 10)
  const max = remaining ?? undefined
  const invalid = Number.isNaN(parsed) || parsed < 1 || (max != null && parsed > max)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault()
          if (!invalid) onConfirm(parsed)
        }}
      >
        <h3 className="font-semibold text-slate-900">Mark as sold</h3>
        <p className="mt-2 text-sm text-slate-600">
          How many units of <span className="font-medium text-navy-900">{productName}</span> were sold?
          {remaining != null && (
            <span className="mt-1 block text-slate-500">{remaining} currently in stock.</span>
          )}
        </p>
        <input
          type="number"
          min={1}
          max={max}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || invalid}
            className="rounded-lg bg-festive-500 px-4 py-2 text-sm font-medium text-white hover:bg-festive-400 disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Mark sold'}
          </button>
        </div>
      </form>
    </div>
  )
}
