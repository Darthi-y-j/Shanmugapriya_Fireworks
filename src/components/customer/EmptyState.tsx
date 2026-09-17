import { PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="mb-4 rounded-full bg-navy-800/5 p-4">
        <PackageOpen className="h-10 w-10 text-navy-700/40" />
      </div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-navy-700/70">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
