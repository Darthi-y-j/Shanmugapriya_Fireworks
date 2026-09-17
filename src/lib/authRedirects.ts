import { SITE_URL } from '@/lib/siteConfig'

/**
 * Canonical origin for auth email links.
 * Production builds always use SITE_URL so confirmation emails never point at localhost
 * after deployment. Local dev (vite) keeps window.location.origin for testing.
 */
function getAuthSiteOrigin(): string {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return window.location.origin
  }
  return SITE_URL
}

/** Where Supabase sends users after they click the signup confirmation link. */
export function getAuthConfirmRedirectUrl(): string {
  return `${getAuthSiteOrigin()}/auth/confirm`
}

/** Where Supabase sends users after they click the password reset link. */
export function getPasswordResetRedirectUrl(): string {
  return `${getAuthSiteOrigin()}/reset-password`
}
