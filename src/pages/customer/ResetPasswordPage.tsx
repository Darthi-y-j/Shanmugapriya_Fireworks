import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, Loader2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AuthCard, AuthPageShell, authInputClass } from '@/components/customer/AuthShell'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { updatePassword } = useAuth()
  const [ready, setReady] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkRecoverySession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const type = hashParams.get('type')

      if (type === 'recovery') {
        if (mounted) setReady(true)
        return
      }

      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!mounted) return

      if (sessionError || !data.session) {
        setInvalidLink(true)
        return
      }

      setReady(true)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' && mounted) {
        setReady(true)
        setInvalidLink(false)
      }
    })

    void checkRecoverySession()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    const { error: updateError } = await updatePassword(password)

    setSubmitting(false)

    if (updateError) {
      setError(updateError)
      return
    }

    navigate('/login?reset=1', { replace: true })
  }

  return (
    <>
      <SEO title="Reset Password" description="Set a new password for your Shanmuga Priya Crackers account." noIndex />

      <AuthPageShell>
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-[#0F2847] drop-shadow-sm sm:text-3xl">
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-[#0F2847]/85 drop-shadow-sm">Choose a strong password for your account</p>
        </div>

        <AuthCard>
          {!ready && !invalidLink && (
            <div className="py-6 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0077B6]" />
              <p className="mt-3 text-sm text-[#0F2847]/70">Verifying reset link…</p>
            </div>
          )}

          {invalidLink && (
            <div className="text-center">
              <p className="text-sm leading-relaxed text-[#0F2847]/85">
                This password reset link is invalid or has expired. Request a new one from the forgot password page.
              </p>
              <Link
                to="/forgot-password"
                className="mt-5 inline-flex w-full justify-center rounded-xl bg-[#0077B6] px-6 py-3 text-sm font-bold text-[#0F2847] shadow-md transition hover:bg-[#0096D6]"
              >
                Request New Link
              </Link>
            </div>
          )}

          {ready && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#0F2847]">
                <KeyRound className="h-4 w-4 text-[#0077B6]" />
                New password
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F2847]">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={authInputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-[#0F2847]">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={authInputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-[#0077B6] py-3 text-sm font-bold text-[#0F2847] shadow-md transition hover:bg-[#0096D6] disabled:opacity-60"
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </AuthCard>
      </AuthPageShell>
    </>
  )
}
