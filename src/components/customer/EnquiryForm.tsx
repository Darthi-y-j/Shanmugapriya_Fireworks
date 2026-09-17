import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { createContactEnquiry } from '@/services/enquiries'
import { validatePhone } from '@/lib/utils'
import type { ContactEnquiryFormData, EnquiryType } from '@/types/database'

export const ENQUIRY_CATEGORIES = [
  { value: '', label: 'Select your preferred experience' },
  { value: 'bulk', label: 'Bulk / Wholesale Order' },
  { value: 'festival', label: 'Festival Order (Diwali, etc.)' },
  { value: 'wedding', label: 'Wedding / Event' },
  { value: 'product', label: 'Product Information' },
  { value: 'delivery', label: 'Delivery & Shipping' },
  { value: 'other', label: 'Other' },
]

export interface EnquiryFormDefaults {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

interface EnquiryFormProps {
  enquiryType?: EnquiryType
  authUserId?: string
  defaults?: EnquiryFormDefaults
  onSuccess?: () => void
  compact?: boolean
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function EnquiryForm({
  enquiryType = 'contact',
  authUserId,
  defaults,
  onSuccess,
  compact = false,
}: EnquiryFormProps) {
  const { showToast } = useToast()
  const nameParts = splitName(defaults?.firstName ? `${defaults.firstName} ${defaults.lastName || ''}` : '')

  const [firstName, setFirstName] = useState(defaults?.firstName ?? nameParts.firstName)
  const [lastName, setLastName] = useState(defaults?.lastName ?? nameParts.lastName)
  const [email, setEmail] = useState(defaults?.email ?? '')
  const [phone, setPhone] = useState(defaults?.phone ?? '')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const inputClass =
    'w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3 py-2 text-[13px] text-navy-900 placeholder:text-navy-900/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25 sm:px-3.5 sm:py-2.5 sm:text-sm'

  const labelClass = 'mb-1 block text-xs font-medium text-navy-800 sm:mb-1.5 sm:text-sm'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      showToast('Please enter your first and last name', 'error')
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Please enter a valid email address', 'error')
      return
    }

    if (!validatePhone(phone)) {
      showToast('Please enter a valid phone number', 'error')
      return
    }

    if (!category) {
      showToast('Please select an enquiry type', 'error')
      return
    }

    if (!message.trim()) {
      showToast('Please tell us about your requirements', 'error')
      return
    }

    setLoading(true)

    const formData: ContactEnquiryFormData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone,
      category,
      message: message.trim(),
      enquiryType,
      authUserId,
    }

    const { error } = await createContactEnquiry(formData)

    setLoading(false)

    if (error) {
      showToast(error, 'error')
      return
    }

    showToast('Your enquiry has been sent! We will get back to you soon.', 'success')
    setCategory('')
    setMessage('')
    onSuccess?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? 'space-y-3 sm:space-y-4' : 'space-y-3 sm:space-y-5'}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label htmlFor="enquiry-first-name" className={labelClass}>
            First Name
          </label>
          <input
            id="enquiry-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enquiry-last-name" className={labelClass}>
            Last Name
          </label>
          <input
            id="enquiry-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label htmlFor="enquiry-email" className={labelClass}>
            Email Address
          </label>
          <input
            id="enquiry-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enquiry-phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-category" className={labelClass}>
          Enquiry Type
        </label>
        <select
          id="enquiry-category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          {ENQUIRY_CATEGORIES.map((opt) => (
            <option key={opt.value || 'placeholder'} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="enquiry-message" className={labelClass}>
          Tell Us About Your Requirements
        </label>
        <textarea
          id="enquiry-message"
          required
          rows={compact ? 3 : 4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What products do you need? How many? Any special requirements?"
          className={`${inputClass} min-h-[84px] resize-none sm:min-h-[120px]`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-xs font-bold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60 sm:w-auto sm:px-5 sm:py-3 sm:text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  )
}
