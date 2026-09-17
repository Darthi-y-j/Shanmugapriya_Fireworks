import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getCustomerProfile, getMyEnquiries } from '@/services/enquiries'
import { splitFullName } from '@/lib/profileStore'
import type { Customer, Enquiry } from '@/types/database'

export interface EnquiryStats {
  total: number
  new: number
  contacted: number
  completed: number
  cancelled: number
}

interface AccountProfileContextType {
  profile: Customer | null
  enquiries: Enquiry[]
  enquiryStats: EnquiryStats
  displayName: string
  firstName: string
  email: string
  phone: string
  memberSince: string
  loading: boolean
  refresh: () => Promise<void>
}

const AccountProfileContext = createContext<AccountProfileContextType | undefined>(undefined)

function computeEnquiryStats(enquiries: Enquiry[]): EnquiryStats {
  return enquiries.reduce(
    (acc, enquiry) => {
      acc.total += 1
      if (enquiry.status === 'new') acc.new += 1
      else if (enquiry.status === 'contacted') acc.contacted += 1
      else if (enquiry.status === 'completed') acc.completed += 1
      else if (enquiry.status === 'cancelled') acc.cancelled += 1
      return acc
    },
    { total: 0, new: 0, contacted: 0, completed: 0, cancelled: 0 },
  )
}

function getMemberSince(userCreatedAt?: string, profile?: Customer | null): string {
  const dateStr = profile?.created_at || userCreatedAt
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-IN', { year: 'numeric' }).format(new Date(dateStr))
}

export function AccountProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Customer | null>(null)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setEnquiries([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [customerProfile, myEnquiries] = await Promise.all([
        getCustomerProfile(user.id),
        getMyEnquiries(user.id),
      ])
      setProfile(customerProfile)
      setEnquiries(myEnquiries)
    } catch {
      setProfile(null)
      setEnquiries([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const displayName =
    profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || 'Customer'
  const { firstName } = splitFullName(displayName)
  const email = user?.email || profile?.email || ''
  const phone = profile?.phone || (user?.user_metadata?.phone as string | undefined) || ''
  const memberSince = getMemberSince(user?.created_at, profile)
  const enquiryStats = useMemo(() => computeEnquiryStats(enquiries), [enquiries])

  const value = useMemo(
    () => ({
      profile,
      enquiries,
      enquiryStats,
      displayName,
      firstName: firstName || displayName,
      email,
      phone,
      memberSince,
      loading,
      refresh,
    }),
    [profile, enquiries, enquiryStats, displayName, firstName, email, phone, memberSince, loading, refresh],
  )

  return <AccountProfileContext.Provider value={value}>{children}</AccountProfileContext.Provider>
}

export function useAccountProfile() {
  const context = useContext(AccountProfileContext)
  if (!context) throw new Error('useAccountProfile must be used within AccountProfileProvider')
  return context
}

export function getEnquiryItemCount(enquiry: Enquiry): number {
  if (enquiry.items?.length) {
    return enquiry.items.reduce((sum, item) => sum + item.quantity, 0)
  }
  return enquiry.quantity || 0
}

export function getEnquiryStatusLabel(status: Enquiry['status']): string {
  switch (status) {
    case 'new':
      return 'New'
    case 'contacted':
      return 'Contacted'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}
