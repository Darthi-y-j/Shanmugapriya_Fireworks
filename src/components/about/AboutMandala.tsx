import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { cn } from '@/lib/utils'

interface AboutMandalaProps {
  className?: string
  flip?: boolean
}

export function AboutMandala({ className, flip }: AboutMandalaProps) {
  return (
    <img
      src={`${ABOUT_IMAGES.rangoliBg}?v=2`}
      alt=""
      className={cn(
        'pointer-events-none absolute select-none opacity-[0.16]',
        flip && '-scale-x-100',
        className,
      )}
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  )
}
