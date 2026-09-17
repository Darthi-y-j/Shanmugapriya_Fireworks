import { Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnquiryReplyButtonProps {
  replied: boolean
  onToggle: (replied: boolean) => void
  disabled?: boolean
  fullWidth?: boolean
}

export function EnquiryReplyButton({
  replied,
  onToggle,
  disabled = false,
  fullWidth = false,
}: EnquiryReplyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onToggle(!replied)
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
        fullWidth && 'w-full',
        replied
          ? 'border border-emerald-200/80 bg-emerald-50 text-emerald-700 shadow-sm hover:bg-emerald-100'
          : 'bg-gradient-to-r from-navy-900 to-navy-800 text-gold-300 shadow-md shadow-navy-900/20 hover:from-navy-800 hover:to-navy-700',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <Check className="h-4 w-4" />
      {replied ? 'Replied' : 'Mark as Replied'}
    </button>
  )
}

export function EnquiryUndoReplyButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-navy-700/55 transition hover:bg-navy-900/5 hover:text-navy-800 disabled:opacity-60"
    >
      <RotateCcw className="h-3 w-3" />
      Undo — mark pending
    </button>
  )
}
