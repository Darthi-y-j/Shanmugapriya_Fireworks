import { StaticPicture } from '@/components/shared/StaticPicture'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { cn } from '@/lib/utils'

interface AboutMandalaProps {
  className?: string
  flip?: boolean
}

export function AboutMandala({ className, flip }: AboutMandalaProps) {
  return (
    <StaticPicture
      src={ABOUT_IMAGES.rangoliBg}
      className={cn(
        'pointer-events-none absolute select-none opacity-[0.16]',
        flip && '-scale-x-100',
        className,
      )}
      imgClassName="h-full w-full object-cover"
    />
  )
}
