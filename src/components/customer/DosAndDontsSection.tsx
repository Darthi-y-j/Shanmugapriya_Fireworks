import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { cn } from '@/lib/utils'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { SectionHeader } from './SectionHeader'
import { AnimateIn } from './AnimateIn'

const dos = [
  'Buy fireworks only from licensed, trusted sellers.',
  'Store crackers in a cool, dry place, away from children.',
  'Light fireworks only in open outdoor spaces.',
  'Keep a bucket of water or sand ready nearby.',
  'Supervise children at all times during celebrations.',
  'Read and follow instructions on every product pack.',
  'Light one firework at a time and step back immediately.',
  'Wear cotton clothing and closed footwear while lighting.',
]

const donts = [
  "Don't light fireworks indoors or near buildings and vehicles.",
  "Don't hold lit sparklers close to your body or clothing.",
  "Don't try to relight a firework that failed to go off.",
  "Don't wear loose or synthetic clothes while handling crackers.",
  "Don't let children handle or light fireworks unsupervised.",
  "Don't store crackers near stoves, gas cylinders, or heat sources.",
  "Don't use alcohol while lighting or handling fireworks.",
  "Don't throw crackers at people, animals, or into crowds.",
]

function SafetyCard({
  variant,
  title,
  items,
  icon: Icon,
}: {
  variant: 'do' | 'dont'
  title: string
  items: string[]
  icon: LucideIcon
}) {
  const isDo = variant === 'do'

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md',
        isDo
          ? 'border-[#0077B6]/35 hover:border-[#0077B6]/55'
          : 'border-[#0F2847]/15 hover:border-[#0F2847]/30',
      )}
    >
      <OptimizedBackground src={SHANMUGA_BRAND.safetyDosDontsBg} />
      <div
        className={cn(
          'absolute inset-0',
          isDo
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_40%,rgba(255,248,225,0.72)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_40%,rgba(255,255,255,0.75)_100%)]',
        )}
        aria-hidden="true"
      />

      <div
        className={cn('relative h-1.5', isDo ? 'bg-[#0077B6]' : 'bg-[#0F2847]')}
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b border-[#0F2847]/10 pb-4">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              isDo ? 'bg-[#0077B6]/20' : 'bg-[#0F2847]/10',
            )}
          >
            <Icon
              className={cn('h-5 w-5', isDo ? 'text-[#E6AC00]' : 'text-[#0F2847]')}
              strokeWidth={2.5}
            />
          </div>
          <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-[#0F2847] sm:text-2xl">
            {title}
          </h3>
        </div>

        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                'flex gap-3 rounded-xl border px-3.5 py-3 text-sm transition',
                isDo
                  ? 'border-[#0077B6]/30 bg-[#FFF8E1]/50 hover:border-[#0077B6]/45'
                  : 'border-[#0F2847]/12 bg-[#FFF8E1]/25 hover:border-[#0F2847]/22',
              )}
            >
              {isDo ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0077B6]" strokeWidth={2.5} />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0F2847]" strokeWidth={2.5} />
              )}
              <span className="leading-relaxed text-[#0F2847]/85">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function DosAndDontsSection({
  compact = false,
  showHeader = true,
}: {
  compact?: boolean
  showHeader?: boolean
}) {
  return (
    <section
      id="safety"
      className={
        compact
          ? ''
          : 'relative overflow-hidden bg-white pb-10 pt-2 sm:pb-14 sm:pt-4'
      }
    >
      <div className={compact ? '' : 'relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8'}>
        {showHeader && (
          <SectionHeader
            icon={ShieldAlert}
            label="Safety"
            title="Fireworks Dos and Don'ts"
            description="Celebrate responsibly — follow these guidelines for a safe and joyful experience"
            align="center"
          />
        )}

        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6',
            showHeader ? 'mt-8 sm:mt-10' : '',
          )}
        >
          <AnimateIn animation="fade-up" delay={80}>
            <SafetyCard variant="do" title="Do's" items={dos} icon={CheckCircle2} />
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={160}>
            <SafetyCard variant="dont" title="Don'ts" items={donts} icon={XCircle} />
          </AnimateIn>
        </div>

        <AnimateIn animation="fade-up" delay={240}>
          <p className="mt-6 text-center text-xs leading-relaxed text-[#0F2847]/65 sm:mt-8 sm:text-sm">
            In case of injury, seek medical help immediately. For product guidance, contact our team on WhatsApp.
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}
