import type { BusinessPolicies, WebsiteSettings } from '@/types/database'
import { cleanPhone } from './utils'

export const ESTABLISHED_YEAR = 1999

export const BUSINESS_ADDRESS = `Shanmugapriya Pyrotech
Ettunanayankanpatti, Pattamputhur (PO)
Virudhunagar District, Tamil Nadu, India`

/** One-line address for cards and meta — avoids double commas when lines were comma-separated. */
export function formatAddressInline(address: string): string {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/,+\s*$/, ''))
    .filter(Boolean)
    .join(', ')
}

export const BUSINESS_PHONE_NUMBERS = ['9443194425', '9790558173']

export const WHATSAPP_NUMBERS: string[] = ['9790558173']

export const BUSINESS_EMAIL = 'shanmugapriyafireworks2021@gmail.com'

/** Stale Prime / Aura / demo values from older Supabase rows */
const LEGACY_PHONE_DIGITS = new Set([
  '6369773883',
  '8903908929',
  '9876543210',
  '9344335242',
  '8825411254',
])

const LEGACY_EMAILS = new Set([
  'primecrackerssivakasi@gmail.com',
  'info@shanmugapriyacrackers.com',
  'info@shanmugapriyacrackers.in',
  'shanmugapriyacrackers@gmail.com',
  'shanmugapriyacrackerssivakasi@gmail.com',
])

const LEGACY_ADDRESS_MARKERS = [
  'prime crackers',
  'chillayanayakanpatti',
  'alamarathupatti',
  'pallapatti',
  'sivakasi, tamil nadu, india',
]

export function isLegacyPhone(phone: string): boolean {
  const digits = cleanPhone(phone)
  const normalized = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits
  return LEGACY_PHONE_DIGITS.has(normalized)
}

export function isLegacyEmail(email: string): boolean {
  return LEGACY_EMAILS.has(email.trim().toLowerCase())
}

export function isLegacyAddress(address: string): boolean {
  const lower = address.trim().toLowerCase()
  return LEGACY_ADDRESS_MARKERS.some((marker) => lower.includes(marker))
}

export function getCanonicalBusinessEmail(settings?: WebsiteSettings): string {
  if (settings?.email && !isLegacyEmail(settings.email)) return settings.email
  return BUSINESS_EMAIL
}

export function getCanonicalBusinessAddress(settings?: WebsiteSettings): string {
  if (settings?.address && !isLegacyAddress(settings.address)) return settings.address
  return BUSINESS_ADDRESS
}

export const BUSINESS_POLICIES: BusinessPolicies = {
  delivery_areas: 'All over India',
  payment_methods: 'Pre-payment',
  whatsapp_response: '24/7 on WhatsApp',
  years_in_business: `Since ${ESTABLISHED_YEAR}`,
  happy_customers: 'Trusted families nationwide',
}

export const BUSINESS_HOURS_24_7 = {
  weekdays: '24/7 — Always Open',
  saturday: '24/7 — Always Open',
  sunday: '24/7 — Always Open',
}

export function getYearsInBusiness(): number {
  return Math.max(1, new Date().getFullYear() - ESTABLISHED_YEAR)
}

export function formatDisplayPhone(phone: string): string {
  const digits = cleanPhone(phone)
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

export function getBusinessPhoneNumbers(_settings?: WebsiteSettings): string[] {
  return [...BUSINESS_PHONE_NUMBERS]
}

export function getWhatsAppNumbers(_settings?: WebsiteSettings): string[] {
  return [...WHATSAPP_NUMBERS]
}

export function getBusinessPolicies(settings: WebsiteSettings): BusinessPolicies {
  return {
    ...BUSINESS_POLICIES,
    ...settings.social_links.policies,
  }
}
