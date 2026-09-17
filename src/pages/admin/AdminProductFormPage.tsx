import { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'
import { getProductById, getAllProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import type { Product, Category } from '@/types/database'

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const isEdit = Boolean(id)
  const [product, setProduct] = useState<Product | undefined>()
  const [categories, setCategories] = useState<Category[]>([])
  const [existingProducts, setExistingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [cats, products] = await Promise.all([getCategories(false, 'active'), getAllProducts()])
      setCategories(cats)
      setExistingProducts(products)

      if (id) {
        const prod = await getProductById(id)
        setProduct(prod || undefined)
      }
      setLoading(false)
    }
    load()
  }, [id])

  return (
    <>
      <AdminHeader
        title={isEdit ? 'Edit Product' : 'Add Product'}
        onMenuClick={onMenuClick}
      />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-festive-500 border-t-transparent" />
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProductForm
              key={product?.id ?? 'new'}
              product={product}
              categories={categories}
              existingProducts={existingProducts}
            />
          </div>
        )}
      </div>
    </>
  )
}
