import { supabase, getSupabaseErrorMessage, isMissingColumnError } from '@/lib/supabase'
import { normalizeReferralCode } from '@/lib/referralCode'
import { generateEnquiryNumber, cleanPhone, sanitizeEnquiryProductId } from '@/lib/utils'
import { expandCartItemsForEnquiry, enquiryHeaderProductId } from '@/lib/giftBox'
import type {
  Enquiry,
  EnquiryFormData,
  CartEnquiryFormData,
  ContactEnquiryFormData,
  EnquiryStatus,
  EnquiryType,
  DashboardStats,
  Customer,
} from '@/types/database'

const ENQUIRY_CATEGORY_LABELS: Record<string, string> = {
  bulk: 'Bulk / Wholesale Order',
  festival: 'Festival Order (Diwali, etc.)',
  wedding: 'Wedding / Event',
  product: 'Product Information',
  delivery: 'Delivery & Shipping',
  other: 'Other',
}

type EnquiryInsertBase = {
  enquiry_number: string
  product_id: string | null
  product_name: string
  quantity: number
  customer_name: string
  customer_phone: string
  customer_message: string | null
  items: unknown[]
  status: 'new'
}

type EnquiryInsertExtended = EnquiryInsertBase & {
  enquiry_type?: EnquiryType
  customer_email?: string | null
  enquiry_category?: string | null
  auth_user_id?: string | null
  referral_code?: string | null
}

function buildLegacyContactMessage(
  message: string | null,
  email?: string | null,
  category?: string | null,
): string | null {
  const parts: string[] = []
  if (email) parts.push(`Email: ${email}`)
  if (category) {
    parts.push(`Category: ${ENQUIRY_CATEGORY_LABELS[category] || category}`)
  }
  if (message) parts.push('', message)
  return parts.length > 0 ? parts.join('\n') : null
}

function prefixProductName(productName: string, enquiryType?: EnquiryType): string {
  if (enquiryType === 'contact') return `[Contact] ${productName}`
  if (enquiryType === 'account') return `[Account] ${productName}`
  return productName
}

function isRpcSignatureMismatch(error: unknown): boolean {
  const code = (error as { code?: string })?.code
  const message = getSupabaseErrorMessage(error).toLowerCase()
  return code === 'PGRST202' || message.includes('no matches were found in the schema cache')
}

function isRpcMissing(error: unknown): boolean {
  const code = (error as { code?: string })?.code
  const message = getSupabaseErrorMessage(error).toLowerCase()
  return (
    code === '42883' ||
    (message.includes('could not find the function') && message.includes('submit_enquiry'))
  )
}

function isForeignKeyViolation(error: unknown): boolean {
  const code = (error as { code?: string })?.code
  const message = getSupabaseErrorMessage(error).toLowerCase()
  return code === '23503' || message.includes('foreign key constraint')
}

function isEnquiryTypeConstraint(error: unknown): boolean {
  const message = getSupabaseErrorMessage(error).toLowerCase()
  return message.includes('enquiries_enquiry_type_check') || message.includes('enquiry_type')
}

async function insertEnquiry(payload: EnquiryInsertExtended) {
  const { enquiry_type, customer_email, enquiry_category, auth_user_id, referral_code, ...base } =
    payload
  const normalizedReferral = referral_code ? normalizeReferralCode(referral_code) || null : null
  const safeProductId = sanitizeEnquiryProductId(base.product_id)

  const rpcParams: Record<string, unknown> = {
    p_enquiry_number: base.enquiry_number,
    p_product_name: base.product_name,
    p_customer_name: base.customer_name,
    p_customer_phone: base.customer_phone,
    p_product_id: safeProductId,
    p_quantity: base.quantity,
    p_customer_message: base.customer_message,
    p_items: base.items ?? [],
    p_enquiry_type: enquiry_type ?? 'cart',
    p_customer_email: customer_email ?? null,
    p_enquiry_category: enquiry_category ?? null,
    p_auth_user_id: auth_user_id ?? null,
  }

  // Only pass when set — sending p_referral_code at all breaks DBs without migration 024.
  if (normalizedReferral) {
    rpcParams.p_referral_code = normalizedReferral
  }

  let rpcResult = await supabase.rpc('submit_enquiry', rpcParams)

  if (rpcResult.error && normalizedReferral && isRpcSignatureMismatch(rpcResult.error)) {
    const { p_referral_code: _removed, ...withoutReferral } = rpcParams
    rpcResult = await supabase.rpc('submit_enquiry', withoutReferral)
  }

  if (rpcResult.error && isForeignKeyViolation(rpcResult.error) && rpcParams.p_product_id) {
    rpcParams.p_product_id = null
    rpcResult = await supabase.rpc('submit_enquiry', rpcParams)
  }

  if (
    rpcResult.error &&
    isEnquiryTypeConstraint(rpcResult.error) &&
    rpcParams.p_enquiry_type === 'order'
  ) {
    rpcParams.p_enquiry_type = 'cart'
    rpcResult = await supabase.rpc('submit_enquiry', rpcParams)
  }

  if (!rpcResult.error && rpcResult.data) {
    return { data: rpcResult.data, error: null }
  }

  if (rpcResult.error && isRpcMissing(rpcResult.error)) {
    return {
      data: null,
      error: {
        message:
          'Enquiry could not be saved. Run supabase/migrations/016_submit_enquiry_rpc.sql in the Supabase SQL Editor, then try again.',
      },
    }
  }

  if (rpcResult.error) {
    return rpcResult
  }

  const extendedResult = await supabase
    .from('enquiries')
    .insert({
      ...base,
      enquiry_type,
      customer_email,
      enquiry_category,
      auth_user_id,
      referral_code: normalizedReferral,
    })
    .select()
    .single()

  if (!extendedResult.error) return extendedResult

  if (!isMissingColumnError(extendedResult.error)) {
    return extendedResult
  }

  return supabase
    .from('enquiries')
    .insert({
      ...base,
      product_name: prefixProductName(base.product_name, enquiry_type),
      customer_message: buildLegacyContactMessage(
        base.customer_message,
        customer_email,
        enquiry_category,
      ),
    })
    .select()
    .single()
}

async function upsertCustomer(name: string, phone: string, email?: string | null) {
  const { error } = await supabase.rpc('upsert_customer_lead', {
    p_name: name,
    p_phone: phone,
    p_email: email || null,
  })

  if (error) {
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .single()

    if (!existingCustomer) {
      await supabase.from('customers').insert({ full_name: name, phone, email: email || null })
    }
  }
}

function formatCustomerNotes(
  address: string,
  message?: string,
  extras?: {
    email?: string
    referralCode?: string
    spinReward?: { label: string; discountAmount?: number }
    isRegistered?: boolean
  },
): string | null {
  const parts: string[] = []

  if (extras?.isRegistered) {
    parts.push('Registered customer (logged in)')
  }
  if (extras?.email?.trim()) {
    parts.push(`Email: ${extras.email.trim()}`)
  }
  if (extras?.referralCode?.trim()) {
    parts.push(`Referral code: ${normalizeReferralCode(extras.referralCode)}`)
  }

  parts.push(`Delivery Address:\n${address.trim()}`)

  if (extras?.spinReward?.label) {
    parts.push(`Spin to Win: ${extras.spinReward.label}`)
    if (extras.spinReward.discountAmount && extras.spinReward.discountAmount > 0) {
      parts.push(`Spin discount: Rs. ${extras.spinReward.discountAmount}`)
    }
  }

  if (message?.trim()) parts.push(`Message:\n${message.trim()}`)
  return parts.join('\n\n')
}

export async function createEnquiry(
  formData: EnquiryFormData,
): Promise<{ data: Enquiry | null; error: string | null }> {
  const enquiryNumber = generateEnquiryNumber()
  const phone = cleanPhone(formData.customerPhone)

  await upsertCustomer(formData.customerName, phone)

  const items = [
    {
      product_id: formData.productId,
      product_name: formData.productName,
      quantity: formData.quantity,
      price: null,
    },
  ]

  const { data, error } = await insertEnquiry({
    enquiry_number: enquiryNumber,
    enquiry_type: 'cart',
    product_id: formData.productId,
    product_name: formData.productName,
    quantity: formData.quantity,
    customer_name: formData.customerName,
    customer_phone: phone,
    customer_message: formatCustomerNotes(formData.customerAddress, formData.customerMessage),
    items,
    status: 'new',
  })

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Enquiry, error: null }
}

export async function createCartEnquiry(
  formData: CartEnquiryFormData,
): Promise<{ data: Enquiry | null; error: string | null }> {
  if (formData.items.length === 0) {
    return { data: null, error: 'Cart is empty' }
  }

  const enquiryNumber = generateEnquiryNumber()
  const phone = cleanPhone(formData.customerPhone)
  const enquiryItems = expandCartItemsForEnquiry(formData.items)
  const totalQuantity = enquiryItems.reduce((sum, i) => sum + i.quantity, 0)

  const productName =
    formData.items.length === 1
      ? formData.items[0].productName
      : `${formData.items.length} products (${formData.items.map((i) => i.productName).join(', ')})`

  await upsertCustomer(formData.customerName, phone, formData.customerEmail)

  const referralCode = formData.referralCode
    ? normalizeReferralCode(formData.referralCode) || null
    : null

  const { data, error } = await insertEnquiry({
    enquiry_number: enquiryNumber,
    enquiry_type: 'order',
    product_id: enquiryHeaderProductId(formData.items) ?? null,
    product_name: productName,
    quantity: totalQuantity,
    customer_name: formData.customerName,
    customer_phone: phone,
    customer_email: formData.customerEmail ?? null,
    auth_user_id: formData.authUserId ?? null,
    referral_code: referralCode,
    customer_message: formatCustomerNotes(formData.customerAddress, formData.customerMessage, {
      email: formData.customerEmail,
      referralCode: referralCode ?? undefined,
      spinReward: formData.spinReward,
      isRegistered: Boolean(formData.authUserId),
    }),
    items: enquiryItems,
    status: 'new',
  })

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Enquiry, error: null }
}

export async function createContactEnquiry(
  formData: ContactEnquiryFormData,
): Promise<{ data: Enquiry | null; error: string | null }> {
  const enquiryNumber = generateEnquiryNumber()
  const phone = cleanPhone(formData.phone)
  const customerName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
  const enquiryType: EnquiryType = formData.enquiryType || 'contact'
  const categoryLabel = ENQUIRY_CATEGORY_LABELS[formData.category] || formData.category || 'General Enquiry'

  await upsertCustomer(customerName, phone, formData.email.trim())

  const { data, error } = await insertEnquiry({
    enquiry_number: enquiryNumber,
    enquiry_type: enquiryType,
    product_id: null,
    product_name: categoryLabel,
    quantity: 1,
    customer_name: customerName,
    customer_phone: phone,
    customer_email: formData.email.trim(),
    customer_message: formData.message.trim(),
    enquiry_category: formData.category || null,
    auth_user_id: formData.authUserId || null,
    items: [],
    status: 'new',
  })

  if (error) return { data: null, error: getSupabaseErrorMessage(error) }
  return { data: data as Enquiry, error: null }
}

export async function getMyEnquiries(authUserId: string): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('auth_user_id', authUserId)
    .order('created_at', { ascending: false })

  if (error) {
    if (isMissingColumnError(error)) return []
    throw new Error(getSupabaseErrorMessage(error))
  }
  return (data as Enquiry[]) || []
}

export async function getCustomerProfile(authUserId: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle()

  if (error) {
    if (isMissingColumnError(error)) return null
    throw new Error(getSupabaseErrorMessage(error))
  }
  return (data as Customer) || null
}

export async function getEnquiries(status?: EnquiryStatus): Promise<Enquiry[]> {
  let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw new Error(getSupabaseErrorMessage(error))
  return (data as Enquiry[]) || []
}

export async function getRecentEnquiries(limit = 10): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(getSupabaseErrorMessage(error))
  return (data as Enquiry[]) || []
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)

  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export function isEnquiryReplied(enquiry: Pick<Enquiry, 'admin_replied' | 'status'>): boolean {
  if (enquiry.admin_replied === true) return true
  if (enquiry.admin_replied === false) return false
  return enquiry.status === 'contacted' || enquiry.status === 'completed'
}

export async function updateEnquiryReplied(
  id: string,
  replied: boolean,
  currentStatus?: EnquiryStatus,
): Promise<{ error: string | null; status?: EnquiryStatus; admin_replied?: boolean; replied_at?: string | null }> {
  const updatePayload: Record<string, unknown> = {
    admin_replied: replied,
    replied_at: replied ? new Date().toISOString() : null,
  }

  if (replied && currentStatus === 'new') {
    updatePayload.status = 'contacted'
  }

  const { data, error } = await supabase
    .from('enquiries')
    .update(updatePayload)
    .eq('id', id)
    .select('status, admin_replied, replied_at')
    .single()

  if (!error) {
    return {
      error: null,
      status: data?.status as EnquiryStatus | undefined,
      admin_replied: data?.admin_replied as boolean | undefined,
      replied_at: (data?.replied_at as string | null) ?? null,
    }
  }

  if (!isMissingColumnError(error)) {
    return { error: getSupabaseErrorMessage(error) }
  }

  const fallbackStatus: EnquiryStatus = replied
    ? currentStatus === 'new'
      ? 'contacted'
      : currentStatus || 'contacted'
    : 'new'

  const { data: fallbackData, error: fallbackError } = await supabase
    .from('enquiries')
    .update({ status: fallbackStatus })
    .eq('id', id)
    .select('status')
    .single()

  if (fallbackError) return { error: getSupabaseErrorMessage(fallbackError) }

  return {
    error: null,
    status: fallbackData?.status as EnquiryStatus,
    admin_replied: replied,
    replied_at: replied ? new Date().toISOString() : null,
  }
}

export async function deleteEnquiry(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('enquiries').delete().eq('id', id)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const countProducts = async (availableOnly = false) => {
    let withArchive = supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_archived', false)
    if (availableOnly) withArchive = withArchive.eq('is_available', true)
    const archivedResult = await withArchive
    if (!archivedResult.error) return archivedResult.count || 0
    if (!isMissingColumnError(archivedResult.error, 'is_archived')) return 0

    let legacy = supabase.from('products').select('*', { count: 'exact', head: true })
    if (availableOnly) legacy = legacy.eq('is_available', true)
    const legacyResult = await legacy
    return legacyResult.count || 0
  }

  const countCategories = async () => {
    const archivedResult = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_archived', false)
    if (!archivedResult.error) return archivedResult.count || 0
    if (!isMissingColumnError(archivedResult.error, 'is_archived')) return 0

    const legacyResult = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    return legacyResult.count || 0
  }

  const [
    totalProducts,
    activeProducts,
    categories,
    { count: newEnquiries },
    { count: todayEnquiries },
    { count: totalEnquiries },
  ] = await Promise.all([
    countProducts(),
    countProducts(true),
    countCategories(),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalProducts,
    activeProducts,
    categories,
    newEnquiries: newEnquiries || 0,
    todayEnquiries: todayEnquiries || 0,
    totalEnquiries: totalEnquiries || 0,
  }
}

export function getEnquiryTypeLabel(type: EnquiryType | null, productName?: string): string {
  if (type) {
    switch (type) {
      case 'contact':
        return 'Contact'
      case 'account':
        return 'Account'
      case 'order':
        return 'Order'
      default:
        return 'Product'
    }
  }

  if (productName?.startsWith('[Contact]')) return 'Contact'
  if (productName?.startsWith('[Account]')) return 'Account'
  return 'Product'
}

export function resolveEnquiryType(enquiry: Pick<Enquiry, 'enquiry_type' | 'product_name'>): EnquiryType {
  if (enquiry.enquiry_type) return enquiry.enquiry_type
  if (enquiry.product_name?.startsWith('[Account]')) return 'account'
  if (enquiry.product_name?.startsWith('[Contact]')) return 'contact'
  return 'cart'
}

/** Cart-page multi-item orders (new `order` type + legacy cart records). */
export function isOrderEnquiry(enquiry: Pick<Enquiry, 'enquiry_type' | 'product_name' | 'items'>): boolean {
  const type = resolveEnquiryType(enquiry)
  if (type === 'order') return true
  if (type !== 'cart') return false
  if (Array.isArray(enquiry.items) && enquiry.items.length > 1) return true
  return Boolean(enquiry.product_name?.includes(' products ('))
}

export function isGeneralEnquiry(enquiry: Pick<Enquiry, 'enquiry_type' | 'product_name' | 'items'>): boolean {
  return !isOrderEnquiry(enquiry)
}

export function getEnquiryCategoryLabel(category: string | null): string {
  if (!category) return 'General Enquiry'
  return ENQUIRY_CATEGORY_LABELS[category] || category
}

/** Customer-facing note only — hides cart/order metadata (address, spin reward, etc.). */
export function getCustomerFacingEnquiryMessage(message: string | null): string | null {
  if (!message?.trim()) return null

  const messageIdx = message.indexOf('Message:\n')
  if (messageIdx >= 0) {
    const userMessage = message.slice(messageIdx + 'Message:\n'.length).trim()
    return userMessage || null
  }

  const isStructuredOrderNote =
    message.includes('Delivery Address:') || message.startsWith('Registered customer')

  if (isStructuredOrderNote) return null

  return message.trim()
}

export function parseEnquiryMessage(message: string | null): {
  email: string | null
  category: string | null
  referralCode: string | null
  body: string
} {
  if (!message) return { email: null, category: null, referralCode: null, body: '' }

  let email: string | null = null
  let category: string | null = null
  let referralCode: string | null = null
  const bodyLines: string[] = []

  for (const line of message.split('\n')) {
    if (line.startsWith('Email: ')) email = line.slice(7).trim()
    else if (line.startsWith('Category: ')) category = line.slice(10).trim()
    else if (line.startsWith('Referral code: ')) referralCode = line.slice(15).trim()
    else bodyLines.push(line)
  }

  const body = bodyLines.join('\n').trim()
  return { email, category, referralCode, body: body || message }
}

export function getEnquiryReferralCode(
  enquiry: Pick<Enquiry, 'referral_code' | 'customer_message'>,
): string | null {
  if (enquiry.referral_code?.trim()) return enquiry.referral_code.trim()
  return parseEnquiryMessage(enquiry.customer_message).referralCode
}
