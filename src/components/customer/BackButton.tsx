import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  className?: string
  variant?: 'dark' | 'light'
  label?: string
}

export function BackButton({ className, variant = 'light', label }: BackButtonProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }
    navigate('/')
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label ?? 'Go back'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95',
        label ? 'px-3 py-2 text-sm font-medium' : 'p-2.5',
        variant === 'dark'
          ? 'text-white hover:bg-white/10'
          : 'text-navy-700 hover:bg-navy-800/5',
        className,
      )}
    >
      <ArrowLeft className="h-5 w-5 shrink-0" />
      {label && <span>{label}</span>}
    </button>
  )
}
