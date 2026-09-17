import { cn } from '@/lib/utils'

interface DiscountOfferTagProps {
  percentage: number
  variant?: 'festive' | 'elite'
  className?: string
}

/** Vertical ribbon with fishtail — pinned top-right */
export function DiscountOfferTag({
  percentage,
  variant = 'festive',
  className,
}: DiscountOfferTagProps) {
  const isElite = variant === 'elite'

  return (
    <div
      className={cn(
        'absolute right-0 top-0 z-10 flex w-[42px] flex-col items-center pt-2 pb-3.5 text-center shadow-[0_4px_14px_rgba(234,88,12,0.45)]',
        isElite
          ? 'bg-[linear-gradient(180deg,#475569_0%,#cbd5e1_48%,#67e8f9_100%)] text-navy-950 shadow-[0_4px_14px_rgba(34,211,238,0.22)]'
          : 'bg-gradient-to-b from-red-500 to-orange-500 text-white',
        className,
      )}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), 50% 100%, 0 calc(100% - 10px))',
      }}
      aria-label={`${percentage}% off`}
    >
      <span className="text-[13px] font-bold leading-none tabular-nums">{percentage}%</span>
      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.08em]">Off</span>
    </div>
  )
}
