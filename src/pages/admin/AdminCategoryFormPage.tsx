import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { getCategories, getCategoryById } from '@/services/categories'
import type { Category } from '@/types/database'

export function AdminCategoryFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const isEdit = Boolean(id)
  const [category, setCategory] = useState<Category | undefined>()
  const [existingCategories, setExistingCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const categories = await getCategories(false, 'active')
      if (cancelled) return
      setExistingCategories(categories)

      if (id) {
        const found = await getCategoryById(id)
        if (cancelled) return
        setCategory(found || undefined)
      }

      setLoading(false)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <>
      <AdminHeader
        title={isEdit ? 'Edit Category' : 'Add Category'}
        onMenuClick={onMenuClick}
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-festive-500 border-t-transparent" />
          </div>
        ) : (
          <div className="admin-card p-6">
            <CategoryForm
              key={category?.id ?? 'new'}
              category={category}
              existingCategories={existingCategories}
              onSuccess={() => navigate('/admin/categories')}
              onCancel={() => navigate('/admin/categories')}
            />
          </div>
        )}
      </div>
    </>
  )
}
