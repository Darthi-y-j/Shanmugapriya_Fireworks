import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AuthCard, AuthPageShell, authInputClass } from '@/components/customer/AuthShell'
import { useAuth } from '@/contexts/AuthContext'
import { COMPANY_EMAIL, COMPANY_EMAIL_SENDER_NAME } from '@/lib/companyEmail'

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: resetError } = await requestPasswordReset(email)

    setSubmitting(false)

    if (resetError) {
      setError(resetError)
      return
    }

    setSuccess(true)
  }

  return (
    <>
      <SEO title="Forgot Password" description="Reset your Shanmuga Priya Crackers account password." noIndex />

      <AuthPageShell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-[#0F2847] drop-shadow-sm sm:text-3xl">
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm text-[#0F2847]/85 drop-shadow-sm">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <AuthCard>
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#0F2847]/85">
                If an account exists for <span className="font-semibold text-[#0F2847]">{email}</span>, we sent a
                password reset link from <span className="font-semibold text-[#0F2847]">{COMPANY_EMAIL_SENDER_NAME}</span>{' '}
                ({COMPANY_EMAIL}). Check your inbox and spam folder.
              </p>
              <Link
                to="/login"
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#0077B6] px-6 py-3 text-sm font-bold text-[#0F2847] shadow-md transition hover:bg-[#0096D6]"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0F2847]">
                <KeyRound className="h-4 w-4 text-[#0077B6]" />
                Reset password
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2847]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-[#0077B6] py-3 text-sm font-bold text-[#0F2847] shadow-md transition hover:bg-[#0096D6] disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </button>

              <p className="mt-4 text-center text-sm text-[#0F2847]/70">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-[#0077B6] hover:text-[#0077B6]">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </AuthCard>
      </AuthPageShell>
    </>
  )
}
