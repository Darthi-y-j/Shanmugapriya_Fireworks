import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { COMPANY_EMAIL_SENDER_NAME, getAuthEmailSenderHint } from '@/lib/companyEmail'
import { AuthFormCard } from '@/components/customer/AuthFormCard'
import { LoginSplitLayout } from '@/components/customer/LoginSplitLayout'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { isSupabaseConfigured } from '@/lib/supabase'
import {
  AUTH_LOGIN_CARD_WIDTH,
  authCardBrandClass,
  authCardButtonClass,
  authCardFooterClass,
  authCardFooterMutedClass,
  authCardLinkClass,
  authCardMutedClass,
  authCardTaglineClass,
  authCardTitleClass,
} from '@/lib/authLayout'
import { cn } from '@/lib/utils'

function isEmailNotConfirmedError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('email not confirmed') || lower.includes('confirm your email')
}

const fieldClass =
  'w-full rounded-lg border border-[#0F2847]/12 bg-white py-2 pl-10 pr-3 text-[13px] text-[#0F2847] placeholder:text-slate-400 transition focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25'

const loginLayoutProps = {
  cardSide: 'right' as const,
  cardMaxWidth: AUTH_LOGIN_CARD_WIDTH,
}

export function LoginPage() {
  const { signInCustomer, resendConfirmationEmail, user, isAdmin, isCustomer, loading } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = (location.state as { from?: string } | null)?.from || '/account'
  const emailVerified = searchParams.get('verified') === '1'
  const passwordReset = searchParams.get('reset') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState(
    emailVerified
      ? 'Your email is confirmed. Sign in with the same email and password you used to register.'
      : passwordReset
        ? 'Your password was updated. Sign in with your new password.'
        : '',
  )
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (emailVerified) {
      setInfo('Your email is confirmed. Sign in with the same email and password you used to register.')
    } else if (passwordReset) {
      setInfo('Your password was updated. Sign in with your new password.')
    }
  }, [emailVerified, passwordReset])

  const emailNotConfirmed = isEmailNotConfirmedError(error)

  if (loading) {
    return (
      <>
        <SEO title="Login" description="Sign in to your Shanmuga Priya Crackers account to send enquiries." noIndex />
        <LoginSplitLayout loading {...loginLayoutProps} />
      </>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  if (user && isCustomer) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { error: signInError } = await signInCustomer(email, password)

    if (signInError) {
      setError(signInError)
    }

    setSubmitting(false)
  }

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('Enter your email address first, then resend the confirmation link.')
      return
    }

    setResending(true)
    setInfo('')

    const { error: resendError } = await resendConfirmationEmail(email.trim())

    setResending(false)

    if (resendError) {
      setError(resendError)
      return
    }

    setError('')
    setInfo(`Confirmation email sent to ${email.trim()}. Check your inbox and spam folder, then sign in again.`)
  }

  return (
    <>
      <SEO title="Login" description="Sign in to your Shanmuga Priya Crackers account to send enquiries." noIndex />

      <LoginSplitLayout {...loginLayoutProps}>
        <AuthFormCard>
          <div className="text-center">
            <img
              src={SITE_LOGO_PATH}
              alt={PRIME_BRAND.displayName}
              className="mx-auto h-10 w-10 rounded-full border-2 border-[#C9A24A] object-cover shadow-md"
            />
            <p className={cn('mt-2', authCardBrandClass)}>
              {PRIME_BRAND.shortName}
            </p>
            <p className={authCardTaglineClass}>
              {PRIME_BRAND.tagline}
            </p>
          </div>

          <div className="mt-4 text-center">
            <h1 className={authCardTitleClass}>Welcome Back</h1>
            <p className={cn('mt-1', authCardMutedClass)}>
              Login to continue shopping for a brighter celebration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            {info && (
              <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{info}</div>
            )}

            {import.meta.env.DEV && !isSupabaseConfigured && (
              <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200/80">
                Supabase is not configured. Copy <code className="text-xs">.env.example</code> to{' '}
                <code className="text-xs">.env</code>, add your{' '}
                <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-xs">VITE_SUPABASE_ANON_KEY</code>, then restart{' '}
                <code className="text-xs">npm run dev</code>.
              </div>
            )}

            {error && !emailNotConfirmed && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {emailNotConfirmed && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <p className="font-semibold">Please confirm your email first</p>
                <p className="mt-1 text-amber-800/90">
                  We sent a confirmation link from {COMPANY_EMAIL_SENDER_NAME} when you registered.
                  Open that email and click the link, then come back here to sign in.
                </p>
                <p className="mt-2 text-xs text-amber-800/80">{getAuthEmailSenderHint()}</p>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {resending ? 'Sending...' : 'Resend confirmation email'}
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              <div>
                <label htmlFor="login-email" className="sr-only">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="sr-only">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(fieldClass, 'pr-10')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0F2847]/80"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="mt-1.5 text-right">
                  <Link
                    to="/forgot-password"
                    className={authCardLinkClass}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || (import.meta.env.DEV && !isSupabaseConfigured)}
              className={cn('mt-4', authCardButtonClass)}
            >
              {submitting ? 'Signing in...' : 'Login'}
              {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <p className={cn('mt-3', authCardFooterClass)}>
              Don&apos;t have an account?{' '}
              <Link to="/register" className={authCardLinkClass}>
                Create account
              </Link>
            </p>

            <p className={cn('mt-2.5', authCardFooterMutedClass)}>
              Store owner?{' '}
              <Link to="/admin/login" className={authCardLinkClass}>
                Admin login
              </Link>
            </p>
          </form>
        </AuthFormCard>
      </LoginSplitLayout>
    </>
  )
}
