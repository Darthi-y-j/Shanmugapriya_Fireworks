import { getSupabaseErrorMessage } from '@/lib/supabase'

/** Map Supabase/auth errors to safe messages for end users (no internal stack or dashboard hints). */
export function formatAuthError(error: unknown): string {
  const raw = getSupabaseErrorMessage(error)
  const lower = raw.toLowerCase()

  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Invalid email or password. Please try again.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.'
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (lower.includes('signup is disabled')) {
    return 'New registrations are not available at the moment.'
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('too many')) {
    return 'Too many attempts. Please wait a few minutes and try again.'
  }
  if (
    lower.includes('network') ||
    lower.includes('timed out') ||
    lower.includes('fetch failed') ||
    lower.includes('failed to fetch')
  ) {
    return 'Could not connect. Please check your internet and try again.'
  }
  if (lower.includes('jwt') || lower.includes('session') && lower.includes('expired')) {
    return 'Your session has expired. Please sign in again.'
  }

  if (import.meta.env.PROD) {
    return 'Something went wrong. Please try again.'
  }

  return raw
}

export function formatAuthConfigError(): string {
  if (import.meta.env.DEV) {
    return 'Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  }
  return 'Sign-in is temporarily unavailable. Please try again later.'
}

export const ADMIN_ACCESS_DENIED_MESSAGE =
  'You do not have permission to access the admin panel. Contact the store owner if you need access.'
