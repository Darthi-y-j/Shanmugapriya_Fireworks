import { cn } from '@/lib/utils'
import { ABOUT_COLORS } from '@/lib/aboutTokens'

type SectionHeaderProps = {
  eyebrow: string
  title: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  align = 'left',
  light = false,
  className,
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <div className={cn(centered && 'text-center', className)}>
      <p
        className={cn(
          'flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em]',
          centered && 'justify-center',
          light ? 'text-white/70' : 'text-slate-500',
        )}
      >
        <span
          className="h-px w-10"
          style={{ backgroundColor: light ? 'rgba(255,255,255,0.35)' : ABOUT_COLORS.gold }}
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <h2
        className={cn(
          'mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]',
          light ? 'text-white' : 'text-[#062B63]',
        )}
      >
        {title}
      </h2>
    </div>
  )
}
