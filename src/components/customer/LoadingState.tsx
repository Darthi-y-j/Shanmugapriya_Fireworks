import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  fullPage?: boolean
}

export function LoadingState({
  message = 'Loading...',
  className,
  fullPage = false,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 animate-fade-in',
        fullPage ? 'min-h-[60vh]' : 'py-12',
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-pulse-gold rounded-full bg-gold-500/20 blur-xl" />
        <Loader2 className="relative h-10 w-10 animate-spin text-gold-500" />
      </div>
      <p className="animate-fade-up text-sm text-navy-700/70 [animation-delay:200ms]">{message}</p>
    </div>
  )
}
