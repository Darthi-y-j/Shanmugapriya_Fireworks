import type { EnquiryStatus } from '@/types/database'
import { cn } from '@/lib/utils'

const statusStyles: Record<EnquiryStatus, string> = {
  new: 'bg-blue-50 text-blue-700 ring-blue-200/80',
  contacted: 'bg-amber-50 text-amber-800 ring-amber-200/80',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
  cancelled: 'bg-red-50 text-red-700 ring-red-200/80',
}

interface StatusBadgeProps {
  status: EnquiryStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset',
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
