import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getCategoryBySlug } from '@/services/categories'
import { LoadingState } from '@/components/customer/LoadingState'

export function CategorySlugRedirect() {
  const { slug } = useParams()
  const [target, setTarget] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setTarget('/products')
      return
    }

    getCategoryBySlug(slug)
      .then((category) => {
        setTarget(category ? `/products?category=${category.id}` : '/products')
      })
      .catch(() => setTarget('/products'))
  }, [slug])

  if (!target) {
    return <LoadingState message="Redirecting..." />
  }

  return <Navigate to={target} replace />
}
