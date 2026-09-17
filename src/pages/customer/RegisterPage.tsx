import { useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, UserPlus } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { AuthFormCard } from '@/components/customer/AuthFormCard'
import { LoginSplitLayout } from '@/components/customer/LoginSplitLayout'
import {
  AUTH_REGISTER_CARD_WIDTH,
  authCardBrandClass,
  authCardButtonClass,
  authCardFooterClass,
  authCardLabelClass,
  authCardLinkClass,
  authCardMutedClass,
  authCardSectionClass,
  authCardTaglineClass,
  authCardTitleClass,
} from '@/lib/authLayout'
import { cn, validatePhone } from '@/lib/utils'
import { COMPANY_EMAIL, COMPANY_EMAIL_SENDER_NAME, getAuthEmailSenderHint } from '@/lib/companyEmail'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'

const registerLayoutProps = {
  cardSide: 'right' as const,
  cardMaxWidth: AUTH_REGISTER_CARD_WIDTH,
  heroTitle: 'Join the Celebration',
  heroSubtitle: 'Create Account · Shop · Enquire',
}

const fieldClass =
  'w-full rounded-lg border border-[#0F2847]/12 bg-white px-3 py-2 text-[13px] text-[#0F2847] placeholder:text-slate-400 transition focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25'

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className={authCardLabelClass}>{label}</label>
      {children}
    </div>
  )
}

export function RegisterPage() {
  const { signUpCustomer, resendConfirmationEmail, user, isAdmin, isCustomer, loading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendInfo, setResendInfo] = useState('')

  if (loading) {
    return (
      <>
        <SEO title="Register" description="Create your Shanmuga Priya Crackers account." noIndex />
        <LoginSplitLayout loading {...registerLayoutProps} />
      </>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  if (user && isCustomer) {
    return <Navigate to="/account" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResendInfo('')

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    const { error: signUpError, needsEmailConfirmation } = await signUpCustomer(
      email.trim(),
      password,
      fullName.trim(),
      phone,
    )

    setSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    if (!needsEmailConfirmation) {
      navigate('/account', { replace: true })
      return
    }

    setRegisteredEmail(email.trim())
    setSuccess(true)
  }

  const handleResend = async () => {
    if (!registeredEmail) return
    setResending(true)
    setResendInfo('')
    const { error: resendError } = await resendConfirmationEmail(registeredEmail)
    setResending(false)
    if (resendError) {
      setResendInfo(resendError)
      return
    }
    setResendInfo(`Confirmation email sent again to ${registeredEmail} from ${COMPANY_EMAIL}. Check inbox and spam.`)
  }

  if (success) {
    return (
      <>
        <SEO title="Register" description="Create your Shanmuga Priya Crackers account." noIndex />
        <LoginSplitLayout {...registerLayoutProps}>
          <AuthFormCard>
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <h1 className={cn('mt-4', authCardTitleClass)}>Check your email</h1>
              <p className={cn('mt-1', authCardMutedClass)}>One more step to activate your account</p>
            </div>

            <div className="mt-4 text-center text-xs leading-relaxed text-white/80">
              We sent a confirmation link to{' '}
              <span className="font-semibold text-white">{registeredEmail}</span> from{' '}
              <span className="font-semibold text-white">{COMPANY_EMAIL_SENDER_NAME}</span> ({COMPANY_EMAIL}).
              Open that email and click <strong>Confirm</strong> to activate your account.
              <p className="mt-2 text-[10px] text-white/55">{getAuthEmailSenderHint()}</p>
              {resendInfo && (
                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{resendInfo}</p>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#C9A24A]/50 bg-white/10 px-3 py-2 text-xs font-semibold text-[#F0E6D2] transition hover:bg-white/15 disabled:opacity-60"
              >
                {resending ? 'Sending…' : 'Resend confirmation email'}
              </button>
              <Link
                to="/login"
                className={cn('mt-4', authCardButtonClass)}
              >
                Go to Login
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AuthFormCard>
        </LoginSplitLayout>
      </>
    )
  }

  return (
    <>
      <SEO title="Register" description="Create your Shanmuga Priya Crackers account to send enquiries." noIndex />

      <LoginSplitLayout {...registerLayoutProps}>
        <AuthFormCard>
          <div className="text-center">
            <img
              src={SITE_LOGO_PATH}
              alt={SHANMUGA_BRAND.displayName}
              className="mx-auto h-10 w-10 rounded-full border-2 border-[#C9A24A] object-cover shadow-md"
            />
            <p className={cn('mt-2', authCardBrandClass)}>{SHANMUGA_BRAND.shortName}</p>
            <p className={authCardTaglineClass}>
              {SHANMUGA_BRAND.tagline}
            </p>
          </div>

          <div className="mt-4 text-center">
            <h1 className={authCardTitleClass}>Create Account</h1>
            <p className={cn('mt-1', authCardMutedClass)}>
              Register with your email — we&apos;ll send a confirmation link from {COMPANY_EMAIL}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className={cn('mb-3 flex items-center gap-1.5', authCardSectionClass)}>
              <UserPlus className="h-3.5 w-3.5 text-[#E8C97A]" />
              New customer
            </div>

            {error && (
              <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-2.5">
              <Field label="Full Name">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={fieldClass}
                />
              </Field>

              <Field label="Email" className="sm:col-span-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </Field>

              <Field label="Confirm Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={fieldClass}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={cn('mt-4', authCardButtonClass)}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
              {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <p className={cn('mt-3', authCardFooterClass)}>
              Already have an account?{' '}
              <Link to="/login" className={authCardLinkClass}>
                Sign in
              </Link>
            </p>
          </form>
        </AuthFormCard>
      </LoginSplitLayout>
    </>
  )
}
