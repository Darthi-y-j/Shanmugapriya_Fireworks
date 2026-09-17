import { useState } from 'react'
import { formatReferralCodesForStorage, parseReferralCodeList } from '@/lib/referralCode'
import { updateWebsiteSettings } from '@/services/settings'
import { useToast } from '@/contexts/ToastContext'
import { useSettings } from '@/contexts/SettingsContext'

export function SettingsForm() {
  const { settings, refresh } = useSettings()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    business_name: settings.business_name,
    tagline: settings.tagline || '',
    phone: settings.phone || '',
    whatsapp_number: settings.whatsapp_number || '',
    email: settings.email || '',
    address: settings.address || '',
    about_text: settings.about_text || '',
    facebook: settings.social_links.facebook || '',
    instagram: settings.social_links.instagram || '',
    youtube: settings.social_links.youtube || '',
    weekdays: settings.business_hours.weekdays || '',
    saturday: settings.business_hours.saturday || '',
    sunday: settings.business_hours.sunday || '',
    referral_codes: (settings.social_links.referral_codes ?? []).join('\n'),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateWebsiteSettings({
      business_name: form.business_name,
      tagline: form.tagline || null,
      phone: form.phone || null,
      whatsapp_number: form.whatsapp_number || null,
      email: form.email || null,
      address: form.address || null,
      about_text: form.about_text || null,
      social_links: {
        facebook: form.facebook || undefined,
        instagram: form.instagram || undefined,
        youtube: form.youtube || undefined,
        referral_codes: formatReferralCodesForStorage(parseReferralCodeList(form.referral_codes)),
      },
      business_hours: {
        weekdays: form.weekdays || undefined,
        saturday: form.saturday || undefined,
        sunday: form.sunday || undefined,
      },
    })

    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Settings saved successfully', 'success')
      await refresh()
    }

    setLoading(false)
  }

  const inputClass =
    'admin-input w-full placeholder:text-slate-400'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Business Information</h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Business Name</label>
          <input
            required
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">About Text</label>
          <textarea
            value={form.about_text}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            rows={5}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Contact Details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              WhatsApp Number *
            </label>
            <input
              required
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              className={inputClass}
              placeholder="919876543210 (country code + number)"
            />
            <p className="mt-1 text-xs text-slate-500">
              Used for all customer enquiry WhatsApp links
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Referral Codes</h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Active referral codes
          </label>
          <textarea
            value={form.referral_codes}
            onChange={(e) => setForm({ ...form, referral_codes: e.target.value })}
            rows={4}
            className={inputClass}
            placeholder="PRIME50&#10;DIWALI2026&#10;One code per line"
          />
          <p className="mt-1 text-xs text-slate-500">
            Customers can enter these on the cart enquiry form. Leave empty to accept any code.
          </p>
          {form.referral_codes.trim() && (
            <p className="mt-2 text-xs font-medium text-slate-600">
              {formatReferralCodesForStorage(parseReferralCodeList(form.referral_codes)).length}{' '}
              code(s) configured
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Social Media</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['facebook', 'instagram', 'youtube'] as const).map((platform) => (
            <div key={platform}>
              <label className="mb-1 block text-sm font-medium capitalize text-slate-700">
                {platform}
              </label>
              <input
                value={form[platform]}
                onChange={(e) => setForm({ ...form, [platform]: e.target.value })}
                className={inputClass}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Business Hours</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Weekdays</label>
            <input
              value={form.weekdays}
              onChange={(e) => setForm({ ...form, weekdays: e.target.value })}
              className={inputClass}
              placeholder="9:00 AM - 8:00 PM"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Saturday</label>
            <input
              value={form.saturday}
              onChange={(e) => setForm({ ...form, saturday: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sunday</label>
            <input
              value={form.sunday}
              onChange={(e) => setForm({ ...form, sunday: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-festive-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-festive-400 disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
