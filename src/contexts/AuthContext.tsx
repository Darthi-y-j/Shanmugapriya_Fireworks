import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import { supabase, getSupabaseErrorMessage, isSupabaseConfigured } from '@/lib/supabase'
import { logLandingPageApi, logLandingPageApiError } from '@/lib/landingPageApiLog'
import { getAuthConfirmRedirectUrl, getPasswordResetRedirectUrl } from '@/lib/authRedirects'
import {
  ADMIN_ACCESS_DENIED_MESSAGE,
  formatAuthConfigError,
  formatAuthError,
} from '@/lib/authErrors'
import { COMPANY_EMAIL_SENDER_NAME } from '@/lib/companyEmail'
import { cleanPhone } from '@/lib/utils'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isAdmin: boolean
  isCustomer: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInCustomer: (email: string, password: string) => Promise<{ error: string | null }>
  signUpCustomer: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>
  resendConfirmationEmail: (email: string) => Promise<{ error: string | null }>
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function verifyAdminAccess(): Promise<boolean> {
  logLandingPageApi('AuthContext.is_admin:start', { rpc: 'is_admin' })
  const startedAt = performance.now()
  const { data, error } = await supabase.rpc('is_admin')

  if (error) {
    logLandingPageApiError('AuthContext.is_admin:failed', {
      ms: Math.round(performance.now() - startedAt),
      error: error.message,
    })
    console.error('Admin check failed:', error.message)
    return false
  }

  logLandingPageApi('AuthContext.is_admin:done', {
    ms: Math.round(performance.now() - startedAt),
    isAdmin: data === true,
  })
  return data === true
}

async function upsertCustomerProfile(
  authUserId: string,
  fullName: string,
  phone: string,
  email: string,
): Promise<{ error: string | null }> {
  const normalizedPhone = cleanPhone(phone)
  if (!normalizedPhone) {
    return { error: 'A valid phone number is required.' }
  }

  const { data: byAuth, error: byAuthError } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (byAuthError && !byAuthError.message.includes('auth_user_id')) {
    return { error: getSupabaseErrorMessage(byAuthError) }
  }

  if (byAuth) {
    const { error } = await supabase
      .from('customers')
      .update({
        full_name: fullName,
        phone: normalizedPhone,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', authUserId)

    return { error: error ? getSupabaseErrorMessage(error) : null }
  }

  const { data: byPhone, error: byPhoneError } = await supabase
    .from('customers')
    .select('id, auth_user_id')
    .eq('phone', normalizedPhone)
    .maybeSingle()

  if (byPhoneError) {
    return { error: getSupabaseErrorMessage(byPhoneError) }
  }

  if (byPhone) {
    if (byPhone.auth_user_id && byPhone.auth_user_id !== authUserId) {
      return { error: 'This phone number is already linked to another account.' }
    }

    const { error } = await supabase
      .from('customers')
      .update({
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', byPhone.id)

    return { error: error ? getSupabaseErrorMessage(error) : null }
  }

  const { error } = await supabase.from('customers').insert({
    auth_user_id: authUserId,
    full_name: fullName,
    phone: normalizedPhone,
    email,
  })

  return { error: error ? getSupabaseErrorMessage(error) : null }
}

async function syncCustomerProfileFromUser(user: User) {
  const fullName = user.user_metadata?.full_name as string | undefined
  const phone = user.user_metadata?.phone as string | undefined
  if (!fullName || !phone) return

  await upsertCustomerProfile(user.id, fullName, phone, user.email || '')
}

const ADMIN_CHECK_EVENTS: AuthChangeEvent[] = ['INITIAL_SESSION', 'SIGNED_IN', 'USER_UPDATED']

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const adminCheckRef = useRef<Promise<boolean> | null>(null)
  const lastCheckedTokenRef = useRef<string | null>(null)
  const isAdminRef = useRef(false)

  const checkAdminStatus = useCallback(async (activeSession: Session | null, force = false) => {
    if (!activeSession) {
      lastCheckedTokenRef.current = null
      isAdminRef.current = false
      setIsAdmin(false)
      return false
    }

    if (!force && lastCheckedTokenRef.current === activeSession.access_token) {
      return isAdminRef.current
    }

    if (adminCheckRef.current) {
      return adminCheckRef.current
    }

    const checkPromise = (async () => {
      const admin = await verifyAdminAccess()
      lastCheckedTokenRef.current = activeSession.access_token
      isAdminRef.current = admin
      setIsAdmin(admin)
      return admin
    })()

    adminCheckRef.current = checkPromise

    try {
      return await checkPromise
    } finally {
      adminCheckRef.current = null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    if (!isSupabaseConfigured) {
      logLandingPageApi('AuthContext.getSession:skipped', { reason: 'supabase_not_configured' })
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    logLandingPageApi('AuthContext.getSession:start')
    const sessionStartedAt = performance.now()

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return
        logLandingPageApi('AuthContext.getSession:done', {
          ms: Math.round(performance.now() - sessionStartedAt),
          hasSession: Boolean(s),
          userId: s?.user?.id ?? null,
        })
        setSession(s)
        setUser(s?.user ?? null)
        if (s) {
          checkAdminStatus(s, true).finally(() => {
            if (mounted) setLoading(false)
          })
        } else {
          setLoading(false)
        }
      })
      .catch((error) => {
        logLandingPageApiError('AuthContext.getSession:failed', {
          ms: Math.round(performance.now() - sessionStartedAt),
          error: error instanceof Error ? error.message : String(error),
        })
        if (mounted) setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return

      setSession(s)
      setUser(s?.user ?? null)

      if (!s) {
        lastCheckedTokenRef.current = null
        isAdminRef.current = false
        setIsAdmin(false)
        return
      }

      if (event === 'TOKEN_REFRESHED') return

      if (ADMIN_CHECK_EVENTS.includes(event)) {
        void checkAdminStatus(s, event === 'SIGNED_IN').then((admin) => {
          if (!admin && event === 'SIGNED_IN' && s.user) {
            void syncCustomerProfileFromUser(s.user)
          }
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [checkAdminStatus])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { error: formatAuthError(error) }
    }

    const activeSession = data.session
    if (!activeSession) {
      return { error: 'Login succeeded but no session was returned. Please try again.' }
    }

    setSession(activeSession)
    setUser(data.user)

    const admin = await checkAdminStatus(activeSession, true)

    if (!admin) {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      isAdminRef.current = false
      setIsAdmin(false)
      lastCheckedTokenRef.current = null
      return {
        error: ADMIN_ACCESS_DENIED_MESSAGE,
      }
    }

    return { error: null }
  }

  const signInCustomer = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { error: formatAuthError(error) }

    const activeSession = data.session
    if (!activeSession) {
      return { error: 'Login succeeded but no session was returned. Please try again.' }
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      return {
        error:
          `Email not confirmed. Open the confirmation link from ${COMPANY_EMAIL_SENDER_NAME}, then sign in again.`,
      }
    }

    setSession(activeSession)
    setUser(data.user)

    const admin = await checkAdminStatus(activeSession, true)
    if (!admin) {
      await syncCustomerProfileFromUser(data.user)
    }

    return { error: null }
  }

  const signUpCustomer = async (email: string, password: string, fullName: string, phone: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const normalizedPhone = cleanPhone(phone)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: normalizedPhone },
        emailRedirectTo: getAuthConfirmRedirectUrl(),
      },
    })

    if (error) return { error: formatAuthError(error) }

    if (data.user && data.user.identities?.length === 0) {
      return {
        error:
          'An account with this email already exists. Sign in, or use "Resend confirmation email" on the login page if you have not verified yet.',
      }
    }

    if (data.session) {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    }

    const needsEmailConfirmation = !data.user?.email_confirmed_at

    if (!needsEmailConfirmation && data.user) {
      const profileError = await upsertCustomerProfile(
        data.user.id,
        fullName,
        normalizedPhone,
        email,
      )
      if (profileError.error) return profileError
      return { error: null, needsEmailConfirmation: false }
    }

    return { error: null, needsEmailConfirmation: true }
  }

  const resendConfirmationEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: getAuthConfirmRedirectUrl(),
      },
    })

    if (error) return { error: formatAuthError(error) }
    return { error: null }
  }

  const requestPasswordReset = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getPasswordResetRedirectUrl(),
    })

    if (error) return { error: formatAuthError(error) }
    return { error: null }
  }

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: formatAuthConfigError() }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) return { error: formatAuthError(error) }

    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    lastCheckedTokenRef.current = null
    isAdminRef.current = false
    setIsAdmin(false)

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    lastCheckedTokenRef.current = null
    isAdminRef.current = false
    setIsAdmin(false)
  }

  const isCustomer = !!user && !isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isCustomer,
        loading,
        signIn,
        signInCustomer,
        signUpCustomer,
        resendConfirmationEmail,
        requestPasswordReset,
        updatePassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
