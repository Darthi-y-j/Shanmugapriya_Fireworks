/** Public social profiles (homepage + schema). */
export const PUBLIC_SOCIAL = {
  youtube: 'https://www.youtube.com/@Shanmugapriyafireworks',
  facebook: '',
  instagram: '',
} as const

export type SocialFollowLink = {
  id: 'youtube' | 'facebook' | 'instagram' | 'whatsapp'
  label: string
  href: string
}

export function getPublicSocialLinks(options?: {
  youtube?: string
  facebook?: string
  instagram?: string
  whatsapp?: string
}): SocialFollowLink[] {
  const youtube = (options?.youtube ?? PUBLIC_SOCIAL.youtube).trim()
  const facebook = (options?.facebook ?? PUBLIC_SOCIAL.facebook).trim()
  const instagram = (options?.instagram ?? PUBLIC_SOCIAL.instagram).trim()
  const whatsapp = (options?.whatsapp ?? '').trim()

  const items: SocialFollowLink[] = []
  if (youtube) items.push({ id: 'youtube', label: 'YouTube', href: youtube })
  if (whatsapp) items.push({ id: 'whatsapp', label: 'WhatsApp', href: whatsapp })
  if (facebook) items.push({ id: 'facebook', label: 'Facebook', href: facebook })
  if (instagram) items.push({ id: 'instagram', label: 'Instagram', href: instagram })
  return items
}
