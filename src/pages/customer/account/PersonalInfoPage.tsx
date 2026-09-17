import { useEffect, useState } from 'react'
import { SEO } from '@/components/shared/SEO'
import { AccountPageHeader, accountInputClass, accountLabelClass, accountContentClass } from '@/components/customer/account/AccountUI'
import { useAccountProfile } from '@/contexts/AccountProfileContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { getExtendedProfile, saveExtendedProfile, splitFullName } from '@/lib/profileStore'
import { updateCustomerProfile, syncAuthMetadata } from '@/services/profile'
import { validatePhone } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export function PersonalInfoPage() {
  const { user } = useAuth()
  const { displayName, email, phone, refresh } = useAccountProfile()
  const { showToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!user) return
    const { firstName, lastName } = splitFullName(displayName)
    const extended = getExtendedProfile(user.id)
    setForm({
      firstName: extended?.firstName || firstName,
      lastName: extended?.lastName || lastName,
      email,
      phone,
    })
  }, [user, displayName, email, phone])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!form.firstName.trim()) {
      showToast('First name is required', 'error')
      return
    }
    if (!validatePhone(form.phone)) {
      showToast('Please enter a valid phone number', 'error')
      return
    }

    setSaving(true)
    const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ')

    const profileError = await updateCustomerProfile(user.id, {
      fullName,
      phone: form.phone,
      email: form.email,
    })
    if (profileError.error) {
      showToast(profileError.error, 'error')
      setSaving(false)
      return
    }

    await syncAuthMetadata(fullName, form.phone)

    saveExtendedProfile(user.id, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    })

    await refresh()
    showToast('Profile updated successfully', 'success')
    setSaving(false)
  }

  return (
    <>
      <SEO title="Personal Information" description="Update your personal details." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Personal Information" />

      <div className={accountContentClass}>
        <form onSubmit={handleSave} className="rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-navy-800">
            Used when you send a WhatsApp enquiry or contact us. Keep your name and mobile number accurate.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>First Name *</label>
              <input
                className={accountInputClass}
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={accountLabelClass}>Last Name</label>
              <input
                className={accountInputClass}
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Email</label>
              <input
                type="email"
                className={accountInputClass}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Mobile Number *</label>
              <input
                type="tel"
                className={accountInputClass}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-2.5 text-sm font-bold text-gold-300 transition hover:bg-navy-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </>
  )
}
