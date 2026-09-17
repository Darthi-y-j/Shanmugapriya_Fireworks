import { supabase, getSupabaseErrorMessage } from '@/lib/supabase'
import type { Customer } from '@/types/database'

export interface CustomerWithStats extends Omit<Customer, 'last_enquiry_at'> {
  enquiry_count: number
  last_enquiry_at: string | null
  recent_products: string[]
}

export async function getCustomers(): Promise<CustomerWithStats[]> {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(getSupabaseErrorMessage(error))
  if (!customers) return []

  const customersWithStats: CustomerWithStats[] = await Promise.all(
    customers.map(async (customer) => {
      const { data: enquiries } = await supabase
        .from('enquiries')
        .select('product_name, created_at')
        .eq('customer_phone', customer.phone)
        .order('created_at', { ascending: false })

      const enquiryList = enquiries || []
      const recentProducts = [...new Set(enquiryList.slice(0, 5).map((e) => e.product_name))]

      return {
        ...customer,
        enquiry_count: enquiryList.length,
        last_enquiry_at: enquiryList[0]?.created_at || null,
        recent_products: recentProducts,
      }
    })
  )

  return customersWithStats
}

export async function getCustomerByPhone(phone: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error) return null
  return data as Customer
}
