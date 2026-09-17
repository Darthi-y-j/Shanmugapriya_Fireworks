import type { EnquiryFormData, CartEnquiryFormData, CartItem } from '@/types/database'
import { cleanPhone } from './utils'
import { formatPrice } from './utils'

export function buildWhatsAppEnquiryMessage(data: EnquiryFormData): string {
  const lines = [
    'Hello,',
    '',
    'I am interested in the following product:',
    '',
    `Product: ${data.productName}`,
    `Quantity: ${data.quantity}`,
    '',
    `Customer Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Address: ${data.customerAddress}`,
  ]

  if (data.customerMessage?.trim()) {
    lines.push('', 'Message:', data.customerMessage.trim())
  }

  lines.push('', 'Thank you.')
  return lines.join('\n')
}

export function buildCartWhatsAppMessage(data: CartEnquiryFormData): string {
  const lines = [
    'Hello,',
    '',
    'I am interested in the following products:',
    '',
  ]

  data.items.forEach((item, index) => {
    const priceStr = item.price != null ? ` (${formatPrice(item.price)} each)` : ''
    const piecesStr = item.pieces != null ? `, ${item.pieces} pcs/pack` : ''
    lines.push(`${index + 1}. ${item.productName} — Qty: ${item.quantity}${piecesStr}${priceStr}`)

    if (item.isGiftBox && item.giftBoxItems?.length) {
      item.giftBoxItems.forEach((inner) => {
        const innerPrice = inner.price != null ? ` (${formatPrice(inner.price)} each)` : ''
        lines.push(`   • ${inner.productName} × ${inner.quantity}${innerPrice}`)
      })
    }
  })

  lines.push('', '— Customer Details —')

  if (data.authUserId) {
    lines.push('✓ Logged-in registered customer')
  }

  lines.push(
    `Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Address: ${data.customerAddress}`,
  )

  if (data.customerEmail?.trim()) {
    lines.push(`Email: ${data.customerEmail.trim()}`)
  }

  if (data.referralCode?.trim()) {
    lines.push(`Referral code: ${data.referralCode.trim().toUpperCase()}`)
  }

  if (data.customerMessage?.trim()) {
    lines.push('', 'Message:', data.customerMessage.trim())
  }

  if (data.spinReward?.label) {
    lines.push('', '— Spin to Win —', `Reward: ${data.spinReward.label}`)
    if (data.spinReward.discountAmount && data.spinReward.discountAmount > 0) {
      lines.push(`Discount applied: ${formatPrice(data.spinReward.discountAmount)}`)
    } else {
      lines.push('(Non-monetary reward — mention on WhatsApp to claim)')
    }
  }

  lines.push('', 'Thank you.')
  return lines.join('\n')
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = cleanPhone(phoneNumber)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleaned}?text=${encoded}`
}

export function buildWhatsAppContactUrl(phoneNumber: string, message?: string): string {
  const cleaned = cleanPhone(phoneNumber)
  if (message) {
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
  }
  return `https://wa.me/${cleaned}`
}

export function buildTelUrl(phone: string): string {
  return `tel:${cleanPhone(phone)}`
}

export function buildMailtoUrl(email: string, subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${params}`
}

export function cartItemToEnquiryItem(item: CartItem) {
  return {
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
  }
}
