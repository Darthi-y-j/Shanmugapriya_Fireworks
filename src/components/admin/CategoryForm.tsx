import { useState } from 'react'
import type { Category } from '@/types/database'
import { slugify } from '@/lib/utils'
import { getNextSortOrder, getSortOrderConflictMessage } from '@/lib/sortOrder'
import { createCategory, updateCategory } from '@/services/categories'
import { ImageUploader } from './ImageUploader'
import { useToast } from '@/contexts/ToastContext'

interface CategoryFormProps {
  category?: Category
  existingCategories: Category[]
  onSuccess: () => void
  onCancel: () => void
}

export function CategoryForm({ category, existingCategories, onSuccess, onCancel }: CategoryFormProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    is_active: category?.is_active ?? true,
    sort_order:
      category?.sort_order?.toString() || getNextSortOrder(existingCategories).toString(),
  })

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: category ? prev.slug : slugify(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sortOrder = parseInt(form.sort_order, 10)
    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      showToast('Enter a valid sort order (0 or higher).', 'error')
      return
    }

    const conflict = getSortOrderConflictMessage(existingCategories, sortOrder, category?.id)
    if (conflict) {
      showToast(conflict, 'error')
      return
    }

    setLoading(true)

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
      sort_order: sortOrder,
    }

    const result = category
      ? await updateCategory(category.id, payload)
      : await createCategory(payload)

    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast(category ? 'Category updated' : 'Category created', 'success')
      onSuccess()
    }

    setLoading(false)
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug *</label>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={inputClass}
        />
      </div>

      <ImageUploader
        bucket="category-images"
        currentUrl={form.image_url}
        onUpload={(url) => setForm({ ...form, image_url: url })}
        onRemove={() => setForm({ ...form, image_url: '' })}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
        <input
          type="number"
          min={0}
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          className={inputClass}
        />
        {!category && (
          <p className="mt-1 text-xs text-slate-500">
            Next available: {getNextSortOrder(existingCategories)}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="rounded"
        />
        Active
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-festive-500 px-4 py-2 text-sm font-medium text-white hover:bg-festive-400 disabled:opacity-60"
        >
          {loading ? 'Saving...' : category ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
