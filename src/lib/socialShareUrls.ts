export type PageShareTarget = {
  id: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'pinterest' | 'email'
  label: string
  href: string
}

export function buildPageShareTargets(url: string, title: string, whatsappHref?: string): PageShareTarget[] {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedBody = encodeURIComponent(`${title}\n${url}`)

  const items: PageShareTarget[] = []

  if (whatsappHref) {
    items.push({ id: 'whatsapp', label: 'WhatsApp', href: whatsappHref })
  }

  items.push(
    {
      id: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'twitter',
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: 'pinterest',
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      id: 'email',
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedBody}`,
    },
  )

  return items
}
