import type { ReactNode } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { HomeSocialShare } from '@/components/prime/HomeSocialShare'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { getPublicSocialLinks } from '@/lib/publicSocial'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

function SocialIconLink({
  href,
  label,
  className,
  children,
}: {
  href: string
  label: string
  className: string
  children: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  )
}

type HomeCelebrationSocialProps = {
  theme?: 'light' | 'dark'
  className?: string
}

export function HomeCelebrationSocial({ theme = 'light', className }: HomeCelebrationSocialProps) {
  const { settings } = useSettings()
  const whatsappNumber = getWhatsAppNumbers()[0]
  const whatsappHref = whatsappNumber
    ? buildWhatsAppContactUrl(whatsappNumber, 'Hello Shanmuga Priya Crackers')
    : ''

  const social = getPublicSocialLinks({
    youtube: settings.social_links.youtube,
    facebook: settings.social_links.facebook,
    instagram: settings.social_links.instagram,
    whatsapp: whatsappHref,
  })

  const onDark = theme === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10',
        className,
      )}
      aria-labelledby="home-social-heading"
    >
      <div className="lg:max-w-sm">
        <h2
          id="home-social-heading"
          className={cn(
            'text-xs font-bold uppercase tracking-[0.16em] sm:text-sm',
            onDark ? 'text-[#E8C56A]' : 'text-[#8B7355]',
          )}
        >
          Follow us on social media
        </h2>
        <p className={cn('mt-2 text-sm', onDark ? 'text-white/80' : 'text-[#062B63]/75')}>
          Watch demos on YouTube and message us on WhatsApp for orders and wholesale quotes.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {social.map((item) => (
            <SocialIconLink
              key={item.id}
              href={item.href}
              label={`Follow on ${item.label}`}
              className={
                item.id === 'youtube'
                  ? 'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md transition hover:brightness-110'
                  : item.id === 'whatsapp'
                    ? 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition hover:brightness-110'
                    : item.id === 'facebook'
                      ? 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md transition hover:brightness-110'
                      : 'inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-md transition hover:brightness-110'
              }
            >
              {item.id === 'whatsapp' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
              ) : item.id === 'youtube' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M10 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              ) : item.id === 'facebook' ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13 10h3l-.5 3H13v9h-3v-9H7v-3h3V7.5C10 5 11.5 3 14.5 3H17v3h-2c-1 0-2 .5-2 2V10z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              )}
            </SocialIconLink>
          ))}
        </div>
      </div>
      <div
        className={cn(
          'min-w-0 flex-1 border-t pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0',
          onDark ? 'border-white/15 lg:border-white/20' : 'border-[#E8DFD0]/80',
        )}
      >
        <HomeSocialShare heading="Share on social media" variant={theme} />
      </div>
    </div>
  )
}
