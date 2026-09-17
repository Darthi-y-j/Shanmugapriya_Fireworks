export type EnquiryStatus = 'new' | 'contacted' | 'completed' | 'cancelled'
export type EnquiryType = 'cart' | 'contact' | 'account' | 'order'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  is_archived: boolean
  archived_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  description: string | null
  specifications: Record<string, string> | null
  price: number | null
  original_price: number | null
  discount_percentage: number | null
  pieces: number | null
  brand: string | null
  tag: string | null
  image_url: string | null
  gallery_urls: string[] | null
  video_url: string | null
  youtube_url: string | null
  stock_quantity: number | null
  stock_alert_limit: number | null
  is_available: boolean
  is_featured: boolean
  is_recommended: boolean
  is_best_seller: boolean
  is_archived: boolean
  archived_at: string | null
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface EnquiryItem {
  product_id: string
  product_name: string
  quantity: number
  price: number | null
}

export interface Enquiry {
  id: string
  enquiry_number: string
  product_id: string | null
  product_name: string
  quantity: number
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_message: string | null
  referral_code: string | null
  enquiry_type: EnquiryType | null
  enquiry_category: string | null
  auth_user_id: string | null
  items: EnquiryItem[]
  status: EnquiryStatus
  admin_replied: boolean | null
  replied_at: string | null
  created_at: string
  updated_at: string
}

export interface GiftBoxContentItem {
  productId: string
  productName: string
  quantity: number
  price: number | null
  imageUrl: string | null
}

export interface CartItem {
  productId: string
  productName: string
  slug: string
  imageUrl: string | null
  price: number | null
  quantity: number
  pieces?: number | null
  description?: string | null
  isGiftBox?: boolean
  giftBoxItems?: GiftBoxContentItem[]
}

export interface WishlistItem {
  productId: string
  productName: string
  slug: string
  imageUrl: string | null
  price: number | null
  addedAt: string
}

export interface CartEnquiryFormData {
  items: CartItem[]
  customerName: string
  customerPhone: string
  customerAddress: string
  customerMessage?: string
  customerEmail?: string
  referralCode?: string
  authUserId?: string
  spinReward?: {
    label: string
    discountAmount?: number
  }
}

export interface Customer {
  id: string
  full_name: string
  phone: string
  email: string | null
  auth_user_id: string | null
  created_at: string
  updated_at: string
  enquiry_count?: number
  last_enquiry_at?: string
}

export interface ContactEnquiryFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  category: string
  message: string
  enquiryType?: EnquiryType
  authUserId?: string
}

export interface AdminUser {
  id: string
  auth_user_id: string
  name: string
  email: string
  role: string
  created_at: string
}

export interface BusinessPolicies {
  delivery_areas?: string
  payment_methods?: string
  whatsapp_response?: string
  years_in_business?: string
  happy_customers?: string
}

export interface SocialLinks {
  facebook?: string
  instagram?: string
  youtube?: string
  twitter?: string
  whatsapp_numbers?: string[]
  /** Active referral codes customers can enter at checkout (admin-managed). */
  referral_codes?: string[]
  policies?: BusinessPolicies
}

export interface BusinessHours {
  weekdays?: string
  saturday?: string
  sunday?: string
}

export interface WebsiteSettings {
  id: string
  business_name: string
  tagline: string | null
  logo_url: string | null
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  address: string | null
  about_text: string | null
  social_links: SocialLinks
  business_hours: BusinessHours
  updated_at: string
}

export interface EnquiryFormData {
  productId: string
  productName: string
  quantity: number
  customerName: string
  customerPhone: string
  customerAddress: string
  customerMessage?: string
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  tag?: string
  tags?: string[]
  availability?: 'all' | 'available' | 'unavailable'
  archived?: 'active' | 'archived' | 'all'
  featured?: boolean
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'newest' | 'sort_order'
  limit?: number
  /** Lighter select for catalogue/list pages — skips heavy JSON fields */
  lite?: boolean
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  categories: number
  newEnquiries: number
  todayEnquiries: number
  totalEnquiries: number
}

export type NewsletterSource = 'footer' | 'home'

export interface NewsletterSubscriber {
  id: string
  email: string
  source: NewsletterSource
  subscribed_at: string
}
