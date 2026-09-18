/** Supabase env helpers — no @supabase/supabase-js import (keeps initial bundle small). */

export function normalizeSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '')
}

export const SUPABASE_URL = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL)
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL !== 'https://your-project.supabase.co' &&
    !SUPABASE_URL.includes('your-project') &&
    SUPABASE_ANON_KEY !== 'your-anon-key-here' &&
    !SUPABASE_ANON_KEY.startsWith('your-'),
)
