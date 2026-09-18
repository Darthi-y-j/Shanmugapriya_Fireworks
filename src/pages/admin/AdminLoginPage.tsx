import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/shared/SEO'
import { AuthFormCard } from '@/components/customer/AuthFormCard'
import { LoginSplitLayout } from '@/components/customer/LoginSplitLayout'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import { StaticPicture } from '@/components/shared/StaticPicture'
import { SITE_UI_LOGO_PATH } from '@/lib/siteConfig'
import {
  AUTH_LOGIN_CARD_WIDTH,
  authCardBrandClass,
  authCardButtonClass,
  authCardFooterClass,
  authCardFooterMutedClass,
  authCardLinkClass,
  authCardMutedClass,
  authCardSectionClass,
  authCardTaglineClass,
  authCardTitleClass,
} from '@/lib/authLayout'
import { cn } from '@/lib/utils'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'

const fieldClass =
  'w-full rounded-lg border border-[#0F2847]/12 bg-white py-2 pl-10 pr-3 text-[13px] text-[#0F2847] placeholder:text-slate-400 transition focus:border-[#0077B6] focus:outline-none focus:ring-2 focus:ring-[#0077B6]/25'

const layoutProps = {
  cardSide: 'right' as const,
  cardMaxWidth: AUTH_LOGIN_CARD_WIDTH,
  heroTitle: 'Manage Your Store',
  heroSubtitle: 'Products · Orders · Enquiries',
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn, user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <>
        <SEO title="Admin Login" description="Sign in to manage Shanmuga Priya Crackers store." noIndex />
        <LoginSplitLayout loading {...layoutProps} />
      </>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email.trim(), password)

    if (signInError) {
      setError(signInError)
      setSubmitting(false)
      return
    }

    navigate('/admin', { replace: true })
  }

  return (
    <>
      <SEO title="Admin Login" description="Sign in to manage Shanmuga Priya Crackers store." noIndex />

      <LoginSplitLayout {...layoutProps}>
        <AuthFormCard>
          <div className="text-center">
            <StaticPicture
              src={SITE_UI_LOGO_PATH}
              alt={SHANMUGA_BRAND.displayName}
              priority
              imgClassName="mx-auto h-10 w-10 rounded-full border-2 border-[#C9A24A] object-cover shadow-md"
            />
            <p className={cn('mt-2', authCardBrandClass)}>{SHANMUGA_BRAND.shortName}</p>
            <p className={authCardTaglineClass}>Store admin</p>
          </div>

          <div className="mt-4 text-center">
            <h1 className={authCardTitleClass}>Admin Login</h1>
            <p className={cn('mt-1', authCardMutedClass)}>
              Manage products, enquiries, and settings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className={cn('mb-3 flex items-center gap-1.5', authCardSectionClass)}>
              <Lock className="h-3.5 w-3.5 text-[#E8C97A]" />
              Secure login
            </div>

            {error && (
              <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
            )}

            {import.meta.env.DEV && !isSupabaseConfigured && (
              <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 ring-1 ring-amber-200/80">
                Supabase is not configured. Add env keys and restart the dev server.
              </div>
            )}

            <div className="space-y-2.5">
              <div className="relative">
                <label htmlFor="admin-email" className="sr-only">Email</label>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div className="relative">
                <label htmlFor="admin-password" className="sr-only">Password</label>
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || (import.meta.env.DEV && !isSupabaseConfigured)}
              className={cn('mt-4', authCardButtonClass)}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
              {!submitting && <ArrowRight className="h-3.5 w-3.5" />}
            </button>

            <p className={authCardFooterMutedClass}>
              Admin access is by invitation only.
            </p>

            <p className={cn('mt-2.5', authCardFooterClass)}>
              Shopping as a customer?{' '}
              <Link to="/login" className={authCardLinkClass}>
                Customer login
              </Link>
            </p>
          </form>
        </AuthFormCard>
      </LoginSplitLayout>
    </>
  )
}
