import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { supabase } from '@/lib/supabase'

type ConfirmStatus = 'loading' | 'success' | 'error'

export function AuthConfirmPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<ConfirmStatus>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const finishSuccess = async () => {
      await supabase.auth.signOut()
      if (!mounted) return
      setStatus('success')
      window.setTimeout(() => {
        navigate('/login?verified=1', { replace: true })
      }, 2500)
    }

    const finishError = (detail: string) => {
      if (!mounted) return
      setMessage(detail)
      setStatus('error')
    }

    const params = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const errorDescription =
      params.get('error_description') || hashParams.get('error_description')

    if (errorDescription) {
      finishError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')))
      return
    }

    const tokenHash = params.get('token_hash')
    const otpType = params.get('type')

    const verifyFromLink = async () => {
      if (tokenHash && otpType) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as 'signup' | 'email',
        })
        if (error) {
          finishError(error.message)
          return
        }
        await finishSuccess()
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (error) {
        finishError(error.message)
        return
      }

      if (data.session?.user?.email_confirmed_at) {
        await finishSuccess()
        return
      }

      finishError('This confirmation link is invalid or has expired. Request a new email from the login page.')
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        void finishSuccess()
      }
    })

    void verifyFromLink()

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <>
      <SEO title="Confirm Email" description="Confirm your Shanmuga Priya Crackers account email." noIndex />

      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-navy-900/10 bg-white p-8 text-center shadow-sm">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold-500" />
              <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">Confirming your email</h1>
              <p className="mt-2 text-sm text-navy-700/70">Please wait a moment…</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">Email confirmed</h1>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                Your account is verified. Redirecting you to sign in…
              </p>
              <Link
                to="/login?verified=1"
                className="mt-6 inline-flex rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 hover:bg-gold-400"
              >
                Sign in now
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h1 className="mt-4 font-display text-2xl font-bold text-navy-900">Could not confirm email</h1>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/70">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex rounded-lg bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 hover:bg-gold-400"
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
