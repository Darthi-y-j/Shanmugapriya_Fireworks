import { useState } from 'react'
import { CheckCircle2, Loader2, Monitor, ShieldCheck, XCircle } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import {
  AccountPageHeader,
  accountInputClass,
  accountLabelClass,
  accountContentClass,
} from '@/components/customer/account/AccountUI'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'
import { changePassword } from '@/services/profile'

export function SecurityPage() {
  const { user, signOut } = useAuth()
  const { showToast } = useToast()

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [changingPassword, setChangingPassword] = useState(false)

  const emailVerified = !!user?.email_confirmed_at

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) {
      showToast('No email on file for this account', 'error')
      return
    }
    if (!passwordForm.current.trim()) {
      showToast('Please enter your current password', 'error')
      return
    }
    if (passwordForm.next.length < 6) {
      showToast('New password must be at least 6 characters', 'error')
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      showToast('New passwords do not match', 'error')
      return
    }
    if (passwordForm.current === passwordForm.next) {
      showToast('New password must be different from your current password', 'error')
      return
    }

    setChangingPassword(true)
    const result = await changePassword(user.email, passwordForm.current, passwordForm.next)
    setChangingPassword(false)

    if (result.error) {
      showToast(result.error, 'error')
      return
    }

    setPasswordForm({ current: '', next: '', confirm: '' })
    showToast('Password updated successfully', 'success')
  }

  return (
    <>
      <SEO title="Password & Security" description="Manage your account security settings." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Password & Security" />

      <div className={`${accountContentClass} space-y-5`}>
        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-navy-900">Email Verification</p>
              <p className="mt-0.5 text-xs text-navy-700/60">{user?.email}</p>
              <p
                className={cn(
                  'mt-1 inline-flex items-center gap-1 text-xs font-medium',
                  emailVerified ? 'text-emerald-600' : 'text-amber-600',
                )}
              >
                {emailVerified ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5" /> Not verified — check your inbox
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-navy-900">Change Password</h3>
          <p className="mt-1 text-sm text-navy-700/60">
            Update your login password. Name, email, and mobile are edited under Personal Information.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <label className={accountLabelClass}>Current Password *</label>
              <input
                type="password"
                className={accountInputClass}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                autoComplete="current-password"
                required
              />
            </div>
            <div>
              <label className={accountLabelClass}>New Password *</label>
              <input
                type="password"
                className={accountInputClass}
                value={passwordForm.next}
                onChange={(e) => setPasswordForm((f) => ({ ...f, next: e.target.value }))}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className={accountLabelClass}>Confirm New Password *</label>
              <input
                type="password"
                className={accountInputClass}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-gold-300 hover:bg-navy-800 disabled:opacity-60"
          >
            {changingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </form>

        <div className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-navy-900">Active Session</h3>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-navy-900/[0.03] p-4">
            <Monitor className="mt-0.5 h-5 w-5 text-navy-600" />
            <div>
              <p className="text-sm font-semibold text-navy-900">Current device</p>
              <p className="mt-0.5 text-xs text-navy-700/60">This browser session is active</p>
              {user?.last_sign_in_at && (
                <p className="mt-1 text-xs text-navy-700/50">
                  Last sign in: {new Date(user.last_sign_in_at).toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Logout from this device
          </button>
        </div>
      </div>
    </>
  )
}
