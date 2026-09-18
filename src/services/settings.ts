import { getSupabaseClient, getSupabaseErrorMessage } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_HOURS_24_7,
  BUSINESS_PHONE_NUMBERS,
  BUSINESS_POLICIES,
  WHATSAPP_NUMBERS,
  isLegacyAddress,
  isLegacyEmail,
  isLegacyPhone,
} from '@/lib/businessInfo'
import { formatReferralCodesForStorage } from '@/lib/referralCode'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import type { WebsiteSettings } from '@/types/database'

export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/channel/UCoTElmkU6uwyUs8Xm9ArFkw',
  facebook: '',
  instagram: '',
} as const

export const DEFAULT_SETTINGS: WebsiteSettings = {
  id: 'default',
  business_name: 'Shanmugapriya Fire Works',
  tagline: 'We Create Your Happiness',
  logo_url: SITE_LOGO_PATH,
  phone: BUSINESS_PHONE_NUMBERS[0] ?? '',
  whatsapp_number: WHATSAPP_NUMBERS[0] ?? '',
  email: BUSINESS_EMAIL,
  address: BUSINESS_ADDRESS,
  about_text:
    'Shanmugapriya Pyrotech brings festivals to life with quality crackers from Virudhunagar. Established in 1999, we offer wholesale and retail fireworks — fancy items, rockets, sparklers and more, with all-India delivery. Contact us on WhatsApp to enquire about prices and stock.',
  social_links: {
    ...SOCIAL_LINKS,
    whatsapp_numbers: [...WHATSAPP_NUMBERS],
    policies: BUSINESS_POLICIES,
  },
  business_hours: BUSINESS_HOURS_24_7,
  updated_at: new Date().toISOString(),
}

function mergeSettings(data: Record<string, unknown> | null): WebsiteSettings {
  if (!data) return DEFAULT_SETTINGS

  const socialLinks = (data.social_links as WebsiteSettings['social_links']) || {}
  const phone =
    !data.phone || isLegacyPhone(String(data.phone)) ? DEFAULT_SETTINGS.phone : (data.phone as string)

  const whatsapp_number =
    !data.whatsapp_number || isLegacyPhone(String(data.whatsapp_number))
      ? DEFAULT_SETTINGS.whatsapp_number
      : (data.whatsapp_number as string)

  const address =
    !data.address || isLegacyAddress(String(data.address))
      ? DEFAULT_SETTINGS.address
      : (data.address as string)

  const email =
    !data.email || isLegacyEmail(String(data.email)) ? DEFAULT_SETTINGS.email : (data.email as string)

  const existingHours = (data.business_hours as WebsiteSettings['business_hours']) || {}
  const isLegacyHours = existingHours.weekdays?.includes('9:00 AM')
  const business_hours = isLegacyHours
    ? DEFAULT_SETTINGS.business_hours
    : { ...DEFAULT_SETTINGS.business_hours, ...existingHours }

  const legacyBusinessNames = [
    'Aura Crackers',
    'AURA CRACKERS',
    'aura crackers',
    'Aura crackers',
    'Prime Crackers',
    'PRIME CRACKERS',
    'prime crackers',
    'Shanmuga Priya Crackers',
  ]

  const business_name =
    !data.business_name ||
    legacyBusinessNames.some(
      (name) => String(data.business_name).trim().toLowerCase() === name.toLowerCase(),
    )
      ? DEFAULT_SETTINGS.business_name
      : (data.business_name as string)

  const tagline =
    !data.tagline || String(data.tagline).trim().toLowerCase() === 'Your Festival, Our Passion'
      ? DEFAULT_SETTINGS.tagline
      : (data.tagline as string)

  return {
    ...DEFAULT_SETTINGS,
    ...(data as unknown as WebsiteSettings),
    business_name,
    tagline,
    logo_url: SITE_LOGO_PATH,
    phone,
    whatsapp_number,
    address,
    email,
    social_links: {
      ...DEFAULT_SETTINGS.social_links,
      ...socialLinks,
      facebook: socialLinks.facebook?.trim() || DEFAULT_SETTINGS.social_links.facebook,
      instagram: socialLinks.instagram?.trim() || DEFAULT_SETTINGS.social_links.instagram,
      youtube: socialLinks.youtube?.trim() || DEFAULT_SETTINGS.social_links.youtube,
      twitter: socialLinks.twitter?.trim() || undefined,
      whatsapp_numbers: (() => {
        const cleaned =
          socialLinks.whatsapp_numbers?.filter((n) => n && !isLegacyPhone(n)) ?? []
        return cleaned.length > 0 ? cleaned : [...WHATSAPP_NUMBERS]
      })(),
      referral_codes: formatReferralCodesForStorage(
        socialLinks.referral_codes?.length
          ? socialLinks.referral_codes
          : DEFAULT_SETTINGS.social_links.referral_codes ?? [],
      ),
      policies: {
        ...DEFAULT_SETTINGS.social_links.policies,
        ...socialLinks.policies,
      },
    },
    business_hours,
  }
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  if (!isSupabaseConfigured) {
    return DEFAULT_SETTINGS
  }

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1)
    .single()

  if (error || !data) {
    return DEFAULT_SETTINGS
  }

  return mergeSettings(data)
}

export async function updateWebsiteSettings(
  settings: Partial<Omit<WebsiteSettings, 'id' | 'updated_at'>>
): Promise<{ data: WebsiteSettings | null; error: string | null }> {
  const existing = await getWebsiteSettings()
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('website_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', existing.id === 'default' ? undefined : existing.id)
    .select()
    .single()

  if (error) {
    if (existing.id === 'default') {
      const { data: inserted, error: insertError } = await supabase
        .from('website_settings')
        .insert(settings)
        .select()
        .single()

      if (insertError) return { data: null, error: getSupabaseErrorMessage(insertError) }
      return { data: mergeSettings(inserted), error: null }
    }
    return { data: null, error: getSupabaseErrorMessage(error) }
  }

  return { data: mergeSettings(data), error: null }
}
