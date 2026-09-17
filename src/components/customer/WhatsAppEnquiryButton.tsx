import { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { createEnquiry } from '@/services/enquiries'
import { buildWhatsAppEnquiryMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { validatePhone } from '@/lib/utils'
import type { EnquiryFormData } from '@/types/database'
import { cn } from '@/lib/utils'

interface WhatsAppEnquiryButtonProps {
  productId: string
  productName: string
  quantity: number
  customerName: string
  customerPhone: string
  customerAddress: string
  customerMessage?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onBeforeOpen?: () => boolean
}

export function WhatsAppEnquiryButton({
  productId,
  productName,
  quantity,
  customerName,
  customerPhone,
  customerAddress,
  customerMessage,
  className,
  size = 'md',
  fullWidth = false,
  onBeforeOpen,
}: WhatsAppEnquiryButtonProps) {
  const { settings } = useSettings()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (onBeforeOpen && !onBeforeOpen()) return

    if (!customerName.trim()) {
      showToast('Please enter your name', 'error')
      return
    }

    if (!validatePhone(customerPhone)) {
      showToast('Please enter a valid phone number', 'error')
      return
    }

    if (!customerAddress.trim()) {
      showToast('Please enter your delivery address', 'error')
      return
    }

    if (!settings.whatsapp_number) {
      showToast('WhatsApp contact is not configured. Please call us instead.', 'error')
      return
    }

    setLoading(true)

    const formData: EnquiryFormData = {
      productId,
      productName,
      quantity,
      customerName: customerName.trim(),
      customerPhone,
      customerAddress: customerAddress.trim(),
      customerMessage,
    }

    try {
      const { error } = await createEnquiry(formData)

      if (error) {
        showToast('Could not save enquiry. Opening WhatsApp anyway...', 'info')
      }

      const message = buildWhatsAppEnquiryMessage(formData)
      const url = buildWhatsAppUrl(settings.whatsapp_number, message)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] font-semibold text-white transition hover:bg-[#20bd5a] disabled:opacity-60',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MessageCircle className="h-5 w-5" />
      )}
      Send Enquiry on WhatsApp
    </button>
  )
}
