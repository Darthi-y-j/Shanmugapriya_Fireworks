import { Truck, CreditCard, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { getBusinessPolicies } from '@/lib/businessInfo'
import { cn } from '@/lib/utils'

function PolicyItem({
  icon: Icon,
  label,
  value,
  variant = 'dark',
}: {
  icon: LucideIcon
  label: string
  value: string
  variant?: 'dark' | 'light'
}) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        isDark
          ? 'border-white/[0.08] bg-white/[0.03]'
          : 'border-navy-900/10 bg-white shadow-sm',
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-500/15 ring-1 ring-gold-400/20">
        <Icon className="h-4 w-4 text-gold-400" />
      </div>
      <div>
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-[0.16em]',
            isDark ? 'text-gold-400/70' : 'text-festive-600/70',
          )}
        >
          {label}
        </p>
        <p className={cn('mt-1 text-sm font-medium', isDark ? 'text-cream-50/90' : 'text-navy-900')}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function BusinessPoliciesGrid({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { settings } = useSettings()
  const policies = getBusinessPolicies(settings)

  const items = [
    { icon: Truck, label: 'Delivery', value: policies.delivery_areas ?? '—' },
    { icon: CreditCard, label: 'Payment', value: policies.payment_methods ?? '—' },
    { icon: Clock, label: 'WhatsApp Response', value: policies.whatsapp_response ?? '—' },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <PolicyItem key={item.label} {...item} variant={variant} />
      ))}
    </div>
  )
}
