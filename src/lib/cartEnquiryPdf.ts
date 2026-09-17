import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CartEnquiryFormData, Enquiry } from '@/types/database'
import { SITE_LOGO_PATH, SITE_NAME } from '@/lib/siteConfig'
import { BUSINESS_ADDRESS } from '@/lib/businessInfo'
import { generateEnquiryNumber } from '@/lib/utils'

const BRAND_ORANGE: [number, number, number] = [234, 88, 12]
const NAVY: [number, number, number] = [30, 27, 75]
const ORBITRON_FONT_FILE = 'Orbitron-Bold.ttf'

let orbitronFontBase64: string | null = null

function formatAddressForPdf(address: string): string {
  return address
    .split('\n')
    .map((line) => line.trim().replace(/,\s*$/, ''))
    .filter(Boolean)
    .join(', ')
}

function formatPdfAmount(price: number | null | undefined): string {
  if (price == null) return '—'
  return `Rs. ${price.toLocaleString('en-IN')}`
}

async function loadOrbitronFont(): Promise<string> {
  if (orbitronFontBase64) return orbitronFontBase64
  const fontUrl = new URL('../assets/fonts/Orbitron-Bold.ttf', import.meta.url)
  const response = await fetch(fontUrl)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!)
  }
  orbitronFontBase64 = btoa(binary)
  return orbitronFontBase64
}

function registerOrbitronFont(doc: jsPDF, base64: string): void {
  doc.addFileToVFS(ORBITRON_FONT_FILE, base64)
  doc.addFont(ORBITRON_FONT_FILE, 'Orbitron', 'bold')
}

async function loadImageDataUrl(
  path: string,
): Promise<{ dataUrl: string; format: 'PNG' | 'JPEG' } | null> {
  try {
    const response = await fetch(path)
    if (!response.ok) return null
    const blob = await response.blob()
    const format: 'PNG' | 'JPEG' = blob.type.includes('png') ? 'PNG' : 'JPEG'
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    return { dataUrl, format }
  } catch {
    return null
  }
}

function drawSpinRewardCallout(
  doc: jsPDF,
  margin: number,
  pageWidth: number,
  y: number,
  label: string,
): number {
  const boxWidth = pageWidth - margin * 2
  const boxHeight = 16
  const boxY = y

  doc.setFillColor(255, 247, 237)
  doc.setDrawColor(...BRAND_ORANGE)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, boxY, boxWidth, boxHeight, 2, 2, 'FD')

  doc.setFont('Orbitron', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text('Spin to Win Gift', margin + 4, boxY + 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(label, margin + 4, boxY + 12)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.text('Free gift with order', pageWidth - margin - 4, boxY + 12, { align: 'right' })

  return boxY + boxHeight + 6
}

export interface CartEnquiryPdfOptions {
  businessName: string
  businessPhone?: string
  enquiryNumber?: string
  estimatedTotal?: number
  spinDiscount?: number
}

export async function downloadCartEnquiryPdf(
  data: CartEnquiryFormData,
  options: CartEnquiryPdfOptions,
): Promise<string> {
  const enquiryNumber = options.enquiryNumber ?? generateEnquiryNumber()
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 14
  let y = margin

  const [fontBase64, logo] = await Promise.all([
    loadOrbitronFont(),
    loadImageDataUrl(SITE_LOGO_PATH),
  ])
  registerOrbitronFont(doc, fontBase64)

  const businessName = (options.businessName || SITE_NAME).toUpperCase()
  const logoSize = 18
  const textX = margin + (logo ? logoSize + 3 : 0)

  if (logo) {
    doc.addImage(logo.dataUrl, logo.format, margin, y - 2, logoSize, logoSize)
  }

  doc.setFont('Orbitron', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...BRAND_ORANGE)
  doc.text(businessName, textX, y + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  y += logoSize + 2
  const addressLines = doc.splitTextToSize(formatAddressForPdf(BUSINESS_ADDRESS), pageWidth - margin * 2)
  doc.text(addressLines, margin, y)
  y += addressLines.length * 4

  if (options.businessPhone) {
    doc.text(`Phone: ${options.businessPhone}`, margin, y)
    y += 5
  }

  y += 4
  doc.setDrawColor(...BRAND_ORANGE)
  doc.setLineWidth(0.4)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  doc.setFont('Orbitron', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...NAVY)
  doc.text('Order Enquiry / Estimate', margin, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  const now = new Date()
  doc.text(`Enquiry No: ${enquiryNumber}`, margin, y)
  doc.text(
    `Date: ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
    pageWidth - margin,
    y,
    { align: 'right' },
  )
  y += 10

  doc.setFont('Orbitron', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...NAVY)
  doc.text('Customer Details', margin, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)

  const customerLines: string[] = [
    `Name: ${data.customerName}`,
    `Phone: ${data.customerPhone}`,
    `Address: ${data.customerAddress}`,
  ]
  if (data.customerEmail) {
    customerLines.push(`Email: ${data.customerEmail}`)
  }
  if (data.referralCode?.trim()) {
    customerLines.push(`Referral code: ${data.referralCode.trim().toUpperCase()}`)
  }
  if (data.authUserId) {
    customerLines.push('Account: Registered customer (logged in)')
  }

  for (const line of customerLines) {
    const wrapped = doc.splitTextToSize(line, pageWidth - margin * 2)
    doc.text(wrapped, margin, y)
    y += wrapped.length * 4.5
  }

  y += 4
  doc.setFont('Orbitron', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...NAVY)
  doc.text('Order Items', margin, y)
  y += 2

  const tableBody: (string | number)[][] = []

  data.items.forEach((item, index) => {
    const lineTotal = item.price != null ? item.price * item.quantity : null
    tableBody.push([
      index + 1,
      item.productName,
      item.quantity,
      formatPdfAmount(item.price),
      formatPdfAmount(lineTotal),
    ])

    if (item.isGiftBox && item.giftBoxItems?.length) {
      item.giftBoxItems.forEach((inner) => {
        tableBody.push([
          '',
          `  • ${inner.productName}`,
          inner.quantity,
          inner.price != null ? formatPdfAmount(inner.price) : '—',
          '—',
        ])
      })
    }
  })

  autoTable(doc, {
    startY: y + 2,
    head: [['#', 'Product', 'Qty', 'Unit Price', 'Amount']],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8.5, cellPadding: 2.5, textColor: [40, 40, 40] },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
    },
    alternateRowStyles: { fillColor: [252, 250, 245] },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8

  const subtotal = options.estimatedTotal ?? 0
  const spinDiscount = options.spinDiscount ?? data.spinReward?.discountAmount ?? 0
  const finalTotal = Math.max(0, subtotal - spinDiscount)
  const hasPricing = data.items.some((item) => item.price != null)

  if (data.spinReward) {
    y = drawSpinRewardCallout(doc, margin, pageWidth, y, data.spinReward.label)
  }

  if (hasPricing && subtotal > 0) {
    const totalsX = pageWidth - margin - 55
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    doc.text('Subtotal:', totalsX, y)
    doc.text(formatPdfAmount(subtotal), pageWidth - margin, y, { align: 'right' })
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...NAVY)
    doc.text('Estimated Total:', totalsX, y)
    doc.text(formatPdfAmount(finalTotal), pageWidth - margin, y, { align: 'right' })
    y += 10
  }

  if (data.customerMessage?.trim()) {
    doc.setFont('Orbitron', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...NAVY)
    doc.text('Customer Message', margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
    const msgLines = doc.splitTextToSize(data.customerMessage.trim(), pageWidth - margin * 2)
    doc.text(msgLines, margin, y)
    y += msgLines.length * 4.5 + 4
  }

  const footerY = Math.max(y + 6, doc.internal.pageSize.getHeight() - 22)
  doc.setDrawColor(220, 220, 220)
  doc.line(margin, footerY, pageWidth - margin, footerY)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  const disclaimer = doc.splitTextToSize(
    'This document is an enquiry estimate for billing reference. Final price, stock availability, and delivery charges will be confirmed on WhatsApp. Not a tax invoice.',
    pageWidth - margin * 2,
  )
  doc.text(disclaimer, margin, footerY + 5)

  const filename = `${enquiryNumber.replace(/[^a-zA-Z0-9-]/g, '')}.pdf`
  doc.save(filename)
  return enquiryNumber
}

function parseStoredEnquiryMessage(message: string | null): {
  customerAddress: string
  customerMessage?: string
  spinReward?: { label: string; discountAmount?: number }
} {
  if (!message?.trim()) {
    return { customerAddress: '' }
  }

  let customerAddress = ''
  let customerMessage: string | undefined
  let spinReward: { label: string; discountAmount?: number } | undefined

  const addressMatch = message.match(/Delivery Address:\n([\s\S]*?)(?:\n\n|$)/)
  if (addressMatch) {
    customerAddress = addressMatch[1].trim()
  }

  const spinLabelMatch = message.match(/Spin to Win: (.+)/)
  if (spinLabelMatch) {
    const label = spinLabelMatch[1].trim()
    const discountMatch = message.match(/Spin discount: Rs\. (\d+)/)
    spinReward = {
      label,
      discountAmount: discountMatch ? Number(discountMatch[1]) : undefined,
    }
  }

  const messageMatch = message.match(/Message:\n([\s\S]*)$/)
  if (messageMatch) {
    customerMessage = messageMatch[1].trim()
  } else if (!addressMatch && !spinLabelMatch) {
    customerAddress = message.trim()
  }

  return { customerAddress, customerMessage, spinReward }
}

export function enquiryToPdfData(enquiry: Enquiry): CartEnquiryFormData {
  const parsed = parseStoredEnquiryMessage(enquiry.customer_message)
  const items =
    enquiry.items?.length > 0
      ? enquiry.items.map((item) => ({
          productId: item.product_id,
          productName: item.product_name,
          slug: '',
          imageUrl: null,
          price: item.price,
          quantity: item.quantity,
        }))
      : enquiry.product_id
        ? [
            {
              productId: enquiry.product_id,
              productName: enquiry.product_name,
              slug: '',
              imageUrl: null,
              price: null,
              quantity: enquiry.quantity,
            },
          ]
        : []

  return {
    items,
    customerName: enquiry.customer_name,
    customerPhone: enquiry.customer_phone,
    customerAddress: parsed.customerAddress,
    customerMessage: parsed.customerMessage,
    customerEmail: enquiry.customer_email ?? undefined,
    referralCode: enquiry.referral_code ?? undefined,
    authUserId: enquiry.auth_user_id ?? undefined,
    spinReward: parsed.spinReward,
  }
}

export async function downloadEnquiryPdf(
  enquiry: Enquiry,
  options: CartEnquiryPdfOptions,
): Promise<string> {
  const data = enquiryToPdfData(enquiry)
  const estimatedTotal = data.items.reduce((sum, item) => {
    if (item.price == null) return sum
    return sum + item.price * item.quantity
  }, 0)
  const spinDiscount = data.spinReward?.discountAmount ?? 0

  return downloadCartEnquiryPdf(data, {
    ...options,
    enquiryNumber: enquiry.enquiry_number,
    estimatedTotal,
    spinDiscount,
  })
}
