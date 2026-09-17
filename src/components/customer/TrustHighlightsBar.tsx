import type { LucideIcon } from 'lucide-react'
import { BadgeCheck, Headphones, ShieldCheck } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { getBusinessPolicies } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

interface TrustHighlight {
  icon: LucideIcon
  title: string
  subtitle: string
}

function TrustHighlightItem({
  icon: Icon,
  title,
  subtitle,
  showDivider,
}: TrustHighlight & { showDivider?: boolean }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-3 border-b border-white/10 px-4 py-5 last:border-b-0 sm:gap-4 sm:px-6 sm:py-6 lg:border-b-0',
        showDivider && 'lg:border-r lg:border-white/15',
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/35 bg-gold-500/10 sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 text-gold-400 sm:h-6 sm:w-6" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white sm:text-[15px]">{title}</p>
        <p className="mt-0.5 text-xs text-white/65 sm:text-sm">{subtitle}</p>
      </div>
    </div>
  )
}

export function TrustHighlightsBar() {
  const { settings } = useSettings()
  const policies = getBusinessPolicies(settings)

  const highlights: TrustHighlight[] = [
    {
      icon: BadgeCheck,
      title: 'Quality Assured',
      subtitle: '100% Satisfaction Guaranteed',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: policies.payment_methods
        ? `${policies.payment_methods} — Safe Checkout`
        : 'Guaranteed Safe Checkout',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      subtitle: policies.whatsapp_response
        ? `${policies.whatsapp_response} Friendly Support Team`
        : '24/7 Friendly Support Team',
    },
  ]

  return (
    <section className="bg-navy-950">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, index) => (
            <TrustHighlightItem
              key={item.title}
              {...item}
              showDivider={index < highlights.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
