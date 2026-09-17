import { supabase, getSupabaseErrorMessage, isSupabaseConfigured } from '@/lib/supabase'
import type { NewsletterSource, NewsletterSubscriber } from '@/types/database'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isValidNewsletterEmail(email: string): boolean {
  return EMAIL_PATTERN.test(normalizeEmail(email))
}

export async function subscribeNewsletter(
  email: string,
  source: NewsletterSource = 'footer',
): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = normalizeEmail(email)

  if (!normalized) {
    return { ok: false, error: 'Please enter your email address' }
  }

  if (!EMAIL_PATTERN.test(normalized)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }

  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Subscription is unavailable right now. Please try again later.' }
  }

  const { data, error } = await supabase.rpc('subscribe_newsletter', {
    p_email: normalized,
    p_source: source,
  })

  if (error) {
    const message = getSupabaseErrorMessage(error).toLowerCase()
    if (message.includes('subscribe_newsletter') || message.includes('could not find the function')) {
      return {
        ok: false,
        error: 'Newsletter signup is not set up yet. Please run the latest database migration.',
      }
    }
    return { ok: false, error: getSupabaseErrorMessage(error) }
  }

  const result = data as { ok?: boolean; error?: string } | null
  if (!result?.ok) {
    if (result?.error === 'invalid_email') {
      return { ok: false, error: 'Please enter a valid email address' }
    }
    return { ok: false, error: 'Could not save your subscription. Please try again.' }
  }

  return { ok: true }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, source, subscribed_at')
    .order('subscribed_at', { ascending: false })

  if (error) throw new Error(getSupabaseErrorMessage(error))
  return (data ?? []) as NewsletterSubscriber[]
}

export async function deleteNewsletterSubscriber(id: string): Promise<void> {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)
  if (error) throw new Error(getSupabaseErrorMessage(error))
}
