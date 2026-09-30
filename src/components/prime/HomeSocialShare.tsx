import { useCallback, useState } from 'react'
import { Link2, MessageCircle, Share2 } from 'lucide-react'
import { SITE_URL } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'

type HomeSocialShareProps = {
  className?: string
}

export function HomeSocialShare({ className }: HomeSocialShareProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${SITE_URL}/`
  const shareText = 'Shanmuga Priya Crackers — Diwali fireworks from Sivakasi'

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [shareUrl])

  return (
    <div className={cn(className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8B7355]">Share this store</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 sm:text-sm"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Facebook
        </a>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A24A]/45 bg-white px-3 py-2 text-xs font-semibold text-[#062B63] shadow-sm transition hover:border-[#0077B6]/40 sm:text-sm"
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
          {copied ? 'Link copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
