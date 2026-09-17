import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Plus, Pencil, Trash2, Archive, ArchiveRestore, GripVertical } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  getCategories,
  deleteCategory,
  archiveCategory,
  restoreCategory,
  updateCategoriesSortOrder,
  type CategoryArchiveFilter,
} from '@/services/categories'
import { getImageUrl, cn } from '@/lib/utils'
import { reorderItems, withSequentialSortOrder } from '@/lib/sortOrder'
import { getSupabaseErrorMessage } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import type { Category } from '@/types/database'

export function AdminCategoriesPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [archiveFilter, setArchiveFilter] = useState<CategoryArchiveFilter>('active')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [archiving, setArchiving] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  const canReorder = archiveFilter === 'active'

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories(false, archiveFilter)
      setCategories(data)
    } catch (err) {
      setCategories([])
      showToast(getSupabaseErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [archiveFilter])

  const handleArchive = async () => {
    if (!archiveId) return
    setArchiving(true)
    const { error } = await archiveCategory(archiveId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Category archived', 'success')
      loadCategories()
    }
    setArchiving(false)
    setArchiveId(null)
  }

  const handleRestore = async (id: string) => {
    const { error } = await restoreCategory(id)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Category restored', 'success')
      loadCategories()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await deleteCategory(deleteId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Category deleted permanently', 'success')
      loadCategories()
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const persistCategoryOrder = async (nextCategories: Category[]) => {
    const ordered = withSequentialSortOrder(nextCategories)
    setCategories(ordered)
    setSavingOrder(true)

    const { error } = await updateCategoriesSortOrder(
      ordered.map((category) => ({ id: category.id, sort_order: category.sort_order })),
    )

    setSavingOrder(false)

    if (error) {
      showToast(error, 'error')
      loadCategories()
      return
    }

    showToast('Category order updated', 'success')
  }

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId || !canReorder) return

    const reordered = reorderItems(categories, draggedId, targetId)
    setDraggedId(null)
    setDragOverId(null)
    await persistCategoryOrder(reordered)
  }

  return (
    <>
      <AdminHeader title="Categories" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-navy-900/8 bg-white p-1 shadow-sm">
            {(['active', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setArchiveFilter(tab)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition',
                  archiveFilter === tab
                    ? 'bg-gradient-to-r from-navy-900 to-navy-800 text-gold-300'
                    : 'text-navy-700/70 hover:bg-cream-50',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {archiveFilter === 'active' && (
            <Link to="/admin/categories/new" className="admin-btn-primary">
              <Plus className="h-4 w-4" />
              Add Category
            </Link>
          )}
        </div>

        {canReorder && categories.length > 1 && (
          <p className="mb-3 text-xs text-slate-500">
            Drag rows using the handle to change display order on the website.
            {savingOrder && ' Saving order...'}
          </p>
        )}

        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead className="border-b border-navy-900/8 bg-cream-50/80">
                <tr>
                  {canReorder && <th className="w-10 px-2 py-3" aria-label="Reorder" />}
                  <th className="px-4 py-3 font-medium text-navy-700/70">Category</th>
                  <th className="px-4 py-3 font-medium text-navy-700/70">Slug</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-navy-700/70">Status</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-navy-700/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/6">
                {loading ? (
                  <tr>
                    <td colSpan={canReorder ? 5 : 4} className="px-4 py-8 text-center text-navy-700/55">Loading...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={canReorder ? 5 : 4} className="px-4 py-8 text-center text-navy-700/55">
                      {archiveFilter === 'archived' ? 'No archived categories' : 'No categories yet'}
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      draggable={canReorder && !savingOrder}
                      onDragStart={() => setDraggedId(category.id)}
                      onDragEnd={() => {
                        setDraggedId(null)
                        setDragOverId(null)
                      }}
                      onDragOver={(e) => {
                        if (!canReorder) return
                        e.preventDefault()
                        setDragOverId(category.id)
                      }}
                      onDragLeave={() => {
                        if (dragOverId === category.id) setDragOverId(null)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        void handleDrop(category.id)
                      }}
                      className={cn(
                        'transition-colors',
                        draggedId === category.id
                          ? 'opacity-50'
                          : dragOverId === category.id
                            ? 'bg-festive-50'
                            : 'hover:bg-cream-50/60',
                      )}
                    >
                      {canReorder && (
                        <td className="px-2 py-3 text-slate-400">
                          <button
                            type="button"
                            aria-label={`Drag to reorder ${category.name}`}
                            className="cursor-grab rounded p-1 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(category.image_url, '/placeholder-category.svg')}
                            alt={category.name}
                            className="h-10 w-10 rounded-lg object-cover ring-1 ring-navy-900/8"
                          />
                          <span className="font-medium text-navy-900">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-navy-700/70">{category.slug}</td>
                      <td className="w-px whitespace-nowrap px-3 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                            category.is_archived
                              ? 'bg-slate-100 text-slate-600 ring-slate-200'
                              : category.is_active
                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                                : 'bg-red-50 text-red-700 ring-red-200',
                          )}
                        >
                          {category.is_archived ? 'Archived' : category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="w-px whitespace-nowrap px-3 py-3">
                        <div className="flex items-center gap-2">
                          {archiveFilter === 'active' ? (
                            <>
                              <Link
                                to={`/admin/categories/${category.id}/edit`}
                                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-festive-500"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setArchiveId(category.id)}
                                className="rounded p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                                title="Archive"
                              >
                                <Archive className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(category.id)}
                                className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Restore"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(category.id)}
                                className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                title="Delete permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!archiveId}
        title="Archive Category"
        message="Archive this category? It will be hidden from the website. Products keep their data but the category won't show."
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setArchiveId(null)}
        loading={archiving}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category Permanently"
        message="Permanently delete this archived category? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  )
}
