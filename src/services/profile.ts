import { supabase, getSupabaseErrorMessage } from '@/lib/supabase'
import { cleanPhone } from '@/lib/utils'
import type { Customer } from '@/types/database'

export async function updateCustomerProfile(
  authUserId: string,
  data: { fullName: string; phone: string; email: string },
): Promise<{ error: string | null }> {
  const normalizedPhone = cleanPhone(data.phone)
  if (!normalizedPhone) {
    return { error: 'A valid phone number is required.' }
  }

  const { data: existing, error: fetchError } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (fetchError) {
    return { error: getSupabaseErrorMessage(fetchError) }
  }

  if (existing) {
    const { error } = await supabase
      .from('customers')
      .update({
        full_name: data.fullName.trim(),
        phone: normalizedPhone,
        email: data.email.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', authUserId)

    return { error: error ? getSupabaseErrorMessage(error) : null }
  }

  const { error } = await supabase.from('customers').insert({
    auth_user_id: authUserId,
    full_name: data.fullName.trim(),
    phone: normalizedPhone,
    email: data.email.trim(),
  })

  return { error: error ? getSupabaseErrorMessage(error) : null }
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  })

  if (signInError) {
    return { error: 'Current password is incorrect.' }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error ? error.message : null }
}

export async function syncAuthMetadata(fullName: string, phone: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName.trim(), phone: cleanPhone(phone) },
  })
  return { error: error ? error.message : null }
}

export function getMemberSinceDate(userCreatedAt?: string, profile?: Customer | null): string {
  const dateStr = profile?.created_at || userCreatedAt
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric' }).format(new Date(dateStr))
}
