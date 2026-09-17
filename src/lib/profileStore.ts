export type AddressType = 'home' | 'work' | 'other'

export interface SavedAddress {
  id: string
  name: string
  mobile: string
  houseNo: string
  street: string
  area: string
  city: string
  district: string
  state: string
  pincode: string
  type: AddressType
  isDefault: boolean
}

export interface ExtendedProfile {
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
}

export interface NotificationPrefs {
  orderUpdates: boolean
  deliveryUpdates: boolean
  offersDiscounts: boolean
  newProducts: boolean
  festivalOffers: boolean
  promotionalEmails: boolean
  whatsappNotifications: boolean
}

export interface AccountPrefs {
  language: string
  emailPreferences: boolean
  whatsappPreferences: boolean
  theme: 'light' | 'dark' | 'system'
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  orderUpdates: true,
  deliveryUpdates: true,
  offersDiscounts: true,
  newProducts: true,
  festivalOffers: true,
  promotionalEmails: false,
  whatsappNotifications: false,
}

const DEFAULT_ACCOUNT_PREFS: AccountPrefs = {
  language: 'en',
  emailPreferences: true,
  whatsappPreferences: true,
  theme: 'light',
}

function storageKey(userId: string, suffix: string) {
  return `prime_profile_${userId}_${suffix}`
}

function legacyStorageKey(userId: string, suffix: string) {
  return `aura_profile_${userId}_${suffix}`
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function readProfileJson<T>(userId: string, suffix: string, fallback: T): T {
  const current = readJson<T | null>(storageKey(userId, suffix), null)
  if (current != null) return current
  return readJson(legacyStorageKey(userId, suffix), fallback)
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getSavedAddresses(userId: string): SavedAddress[] {
  return readProfileJson(userId, 'addresses', [])
}

export function saveAddresses(userId: string, addresses: SavedAddress[]) {
  writeJson(storageKey(userId, 'addresses'), addresses)
}

export function getExtendedProfile(userId: string): ExtendedProfile | null {
  return readProfileJson<ExtendedProfile | null>(userId, 'extended', null)
}

export function saveExtendedProfile(userId: string, profile: ExtendedProfile) {
  writeJson(storageKey(userId, 'extended'), profile)
}

export function getNotificationPrefs(userId: string): NotificationPrefs {
  return readProfileJson(userId, 'notifications', DEFAULT_NOTIFICATION_PREFS)
}

export function saveNotificationPrefs(userId: string, prefs: NotificationPrefs) {
  writeJson(storageKey(userId, 'notifications'), prefs)
}

export function getAccountPrefs(userId: string): AccountPrefs {
  return readProfileJson(userId, 'preferences', DEFAULT_ACCOUNT_PREFS)
}

export function saveAccountPrefs(userId: string, prefs: AccountPrefs) {
  writeJson(storageKey(userId, 'preferences'), prefs)
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function createAddressId() {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
