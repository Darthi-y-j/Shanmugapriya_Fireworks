import { useCallback, useState } from 'react'
import { Link2, Mail, MessageCircle, Send, Share2 } from 'lucide-react'
import { PUBLIC_SOCIAL } from '@/lib/publicSocial'
import { SITE_URL } from '@/lib/siteConfig'
import { getWhatsAppNumbers } from '@/lib/businessInfo'
import { buildPageShareTargets, type PageShareTarget } from '@/lib/socialShareUrls'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

type HomeSocialShareProps = {
  className?: string
  heading?: string
  variant?: 'light' | 'dark'
}

const SHARE_BUTTON: Record<string, string> = {
  whatsapp:
    'inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
  facebook:
    'inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
  twitter:
    'inline-flex items-center gap-1.5 rounded-full bg-[#0F1419] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 sm:text-sm',
  linkedin:
    'inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
  telegram:
    'inline-flex items-center gap-1.5 rounded-full bg-[#229ED9] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
  pinterest:
    'inline-flex items-center gap-1.5 rounded-full bg-[#E60023] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
  email:
    'inline-flex items-center gap-1.5 rounded-full bg-[#062B63] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm',
}

function ShareIcon({ id }: { id: PageShareTargetId }) {
  if (id === 'whatsapp') return <MessageCircle className="h-4 w-4" aria-hidden="true" />
  if (id === 'email') return <Mail className="h-4 w-4" aria-hidden="true" />
  if (id === 'telegram') return <Send className="h-4 w-4" aria-hidden="true" />
  return <Share2 className="h-4 w-4" aria-hidden="true" />
}

type PageShareTargetId = PageShareTarget['id']

export function HomeSocialShare({
  className,
  heading = 'Share this store',
  variant = 'light',
}: HomeSocialShareProps) {
  const onDark = variant === 'dark'
  const [copied, setCopied] = useState(false)
  const shareUrl = `${SITE_URL}/`
  const shareText = 'Shanmuga Priya Crackers — Diwali fireworks from Sivakasi'

  const whatsappNumber = getWhatsAppNumbers()[0]
  const whatsappHref = whatsappNumber
    ? buildWhatsAppContactUrl(whatsappNumber, `${shareText}\n${shareUrl}`)
    : `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`

  const shareTargets = buildPageShareTargets(shareUrl, shareText, whatsappHref)
  const youtubeUrl = PUBLIC_SOCIAL.youtube

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [shareUrl])

  const nativeShare = useCallback(async () => {
    if (!navigator.share) return
    try {
      await navigator.share({ title: shareText, text: shareText, url: shareUrl })
    } catch {
      /* user cancelled */
    }
  }, [shareText, shareUrl])

  return (
    <div className={cn(className)}>
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.14em]',
          onDark ? 'text-[#E8C56A]' : 'text-[#8B7355]',
        )}
      >
        {heading}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {shareTargets.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.id === 'email' ? undefined : '_blank'}
            rel={item.id === 'email' ? undefined : 'noopener noreferrer'}
            className={SHARE_BUTTON[item.id]}
          >
            <ShareIcon id={item.id} />
            {item.label}
          </a>
        ))}
        {youtubeUrl ? (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0000] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 15.5v-7l6 3.5-6 3.5z" />
            </svg>
            YouTube
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => void copyLink()}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition sm:text-sm',
            onDark
              ? 'border-white/25 bg-white/10 text-white hover:bg-white/15'
              : 'border-[#C9A24A]/45 bg-white text-[#062B63] hover:border-[#0077B6]/40',
          )}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
          <button
            type="button"
            onClick={() => void nativeShare()}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition sm:text-sm',
              onDark
                ? 'border-white/25 bg-white/10 text-white hover:bg-white/15'
                : 'border-[#062B63]/20 bg-[#FFFCF7] text-[#062B63] hover:border-[#0077B6]/40',
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </button>
        ) : null}
      </div>
    </div>
  )
}
