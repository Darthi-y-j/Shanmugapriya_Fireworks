import { useState, type FormEvent, type ReactNode } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { subscribeNewsletter } from '@/services/newsletter'
import type { NewsletterSource } from '@/types/database'
import { cn } from '@/lib/utils'

interface NewsletterSubscribeFormProps {
  source: NewsletterSource
  className?: string
  inputClassName?: string
  buttonClassName?: string
  buttonContent: ReactNode
  submittingLabel?: string
}

export function NewsletterSubscribeForm({
  source,
  className,
  inputClassName,
  buttonClassName,
  buttonContent,
  submittingLabel = 'Saving…',
}: NewsletterSubscribeFormProps) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const result = await subscribeNewsletter(email, source)
      if (!result.ok) {
        showToast(result.error, 'error')
        return
      }
      showToast('Thank you for subscribing!', 'success')
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={inputClassName}
        aria-label="Email address"
        autoComplete="email"
        disabled={submitting}
        required
      />
      <button
        type="submit"
        className={cn(buttonClassName, submitting && 'cursor-wait opacity-80')}
        aria-label="Subscribe"
        disabled={submitting}
      >
        {submitting ? submittingLabel : buttonContent}
      </button>
    </form>
  )
}
