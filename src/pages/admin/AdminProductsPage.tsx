import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, GripVertical, Archive, ArchiveRestore, ShoppingBag, Download } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { RecordSaleDialog } from '@/components/admin/RecordSaleDialog'
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  updateProductsSortOrder,
  archiveProduct,
  restoreProduct,
  recordProductSale,
} from '@/services/products'
import { getCategories } from '@/services/categories'
import { formatPrice, getImageUrl, cn } from '@/lib/utils'
import { resolveProductPrice } from '@/lib/pricing'
import { reorderItems, withSequentialSortOrder } from '@/lib/sortOrder'
import { useToast } from '@/contexts/ToastContext'
import { useStockAlerts } from '@/contexts/StockAlertContext'
import { isLowStock } from '@/lib/stock'
import { groupProductsByCategory } from '@/components/customer/CategoryGroupedProducts'
import { getSupabaseErrorMessage } from '@/lib/supabase'
import { downloadProductsExcel } from '@/lib/exportProductsExcel'
import { clearCatalogOnly } from '@/services/catalogCleanup'
import type { Product, Category } from '@/types/database'

export function AdminProductsPage() {
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>()
  const { showToast } = useToast()
  const { showStockAlerts } = useStockAlerts()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all')
  const [archiveFilter, setArchiveFilter] = useState<'active' | 'archived'>('active')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archiving, setArchiving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [saleProduct, setSaleProduct] = useState<Product | null>(null)
  const [recordingSale, setRecordingSale] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [clearAllOpen, setClearAllOpen] = useState(false)
  const [clearingAll, setClearingAll] = useState(false)

  const canReorder = archiveFilter === 'active' && !search && !categoryFilter && availabilityFilter === 'all'

  const groupedProducts = useMemo(
    () => groupProductsByCategory(products, categories),
    [products, categories],
  )

  const columnCount = canReorder ? 8 : 7

  const loadProducts = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([
        getAllProducts({
          search: search || undefined,
          categoryId: categoryFilter || undefined,
          availability: availabilityFilter,
          archived: archiveFilter,
        }),
        getCategories(false, archiveFilter === 'archived' ? 'all' : 'active'),
      ])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      setProducts([])
      showToast(getSupabaseErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [search, categoryFilter, availabilityFilter, archiveFilter])

  const handleArchive = async () => {
    if (!archiveId) return
    setArchiving(true)
    const { error } = await archiveProduct(archiveId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Product archived', 'success')
      loadProducts()
    }
    setArchiving(false)
    setArchiveId(null)
  }

  const handleRestore = async (id: string) => {
    const { error } = await restoreProduct(id)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Product restored', 'success')
      loadProducts()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await deleteProduct(deleteId)
    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Product deleted', 'success')
      loadProducts()
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const handleDownloadProducts = () => {
    if (products.length === 0) {
      showToast('No products to download', 'error')
      return
    }

    setDownloading(true)
    try {
      downloadProductsExcel(products, categories)
      showToast(`Downloaded ${products.length} products`, 'success')
    } catch {
      showToast('Could not export products. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleClearAll = async () => {
    setClearingAll(true)
    const result = await clearCatalogOnly()
    setClearingAll(false)
    setClearAllOpen(false)

    if (result.errors.length > 0) {
      showToast(result.errors[0], 'error')
      return
    }

    showToast(
      `Deleted ${result.removedProducts} products and ${result.removedCategories} categories`,
      'success',
    )
    await loadProducts()
  }

  const toggleAvailability = async (product: Product) => {
    const { error } = await updateProduct(product.id, { is_available: !product.is_available })
    if (error) {
      showToast(error, 'error')
    } else {
      showToast(`Product ${product.is_available ? 'deactivated' : 'activated'}`, 'success')
      loadProducts()
    }
  }

  const handleRecordSale = async (quantity: number) => {
    if (!saleProduct) return
    setRecordingSale(true)
    const result = await recordProductSale(saleProduct.id, quantity)
    setRecordingSale(false)

    if (result.error) {
      showToast(result.error, 'error')
      return
    }

    setSaleProduct(null)
    showStockAlerts([result])
    showToast(
      result.remaining != null
        ? `Sold ${quantity}. ${result.remaining} left in stock.`
        : `Sold ${quantity}.`,
      'success',
    )
    loadProducts()
  }

  const persistProductOrder = async (nextProducts: Product[]) => {
    const ordered = withSequentialSortOrder(nextProducts)
    setProducts(ordered)
    setSavingOrder(true)

    const { error } = await updateProductsSortOrder(
      ordered.map((product) => ({ id: product.id, sort_order: product.sort_order }))
    )

    setSavingOrder(false)

    if (error) {
      showToast(error, 'error')
      loadProducts()
      return
    }

    showToast('Product order updated', 'success')
  }

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId || !canReorder) return

    const dragged = products.find((product) => product.id === draggedId)
    const target = products.find((product) => product.id === targetId)
    if (!dragged || !target) return

    const draggedGroup = dragged.category_id || 'uncategorized'
    const targetGroup = target.category_id || 'uncategorized'
    if (draggedGroup !== targetGroup) {
      setDraggedId(null)
      setDragOverId(null)
      showToast('Reorder products within the same category.', 'error')
      return
    }

    const nextGroups = groupedProducts.map((group) => {
      if (group.id !== draggedGroup) return group
      return { ...group, products: reorderItems(group.products, draggedId, targetId) }
    })

    setDraggedId(null)
    setDragOverId(null)
    await persistProductOrder(nextGroups.flatMap((group) => group.products))
  }

  return (
    <>
      <AdminHeader title="Products" onMenuClick={onMenuClick} />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
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
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as typeof availabilityFilter)}
              className="admin-input"
              disabled={archiveFilter === 'archived'}
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setClearAllOpen(true)}
              disabled={clearingAll || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {clearingAll ? 'Deleting…' : 'Clear all'}
            </button>
            <button
              type="button"
              onClick={handleDownloadProducts}
              disabled={downloading || loading || products.length === 0}
              className="admin-btn-secondary"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Downloading…' : 'Download Products'}
            </button>
            {archiveFilter === 'active' && (
              <Link to="/admin/products/new" className="admin-btn-primary">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            )}
          </div>
        </div>

        {canReorder && products.length > 1 && (
          <p className="mb-3 text-xs text-slate-500">
            Drag rows within a category to change display order on the website.
            {savingOrder && ' Saving order...'}
          </p>
        )}

        {!canReorder && products.length > 0 && (
          <p className="mb-3 text-xs text-amber-700">
            Clear search and filters to drag and reorder products.
          </p>
        )}

        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {canReorder && <th className="w-10 px-2 py-3" aria-label="Reorder" />}
                  <th className="px-4 py-3 font-medium text-slate-600">Product</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Brand</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-slate-600">Price</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-slate-600">Pieces</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-slate-600">Stock</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-slate-600">Status</th>
                  <th className="w-px whitespace-nowrap px-3 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={columnCount} className="px-4 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="px-4 py-8 text-center text-slate-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  groupedProducts.flatMap((group) => [
                    <tr key={`category-${group.id}`} className="bg-cream-50">
                      <td colSpan={columnCount} className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-0.5 w-6 rounded-full bg-gradient-to-r from-festive-500 to-gold-400"
                            aria-hidden="true"
                          />
                          <span className="font-display text-sm font-bold text-navy-900">
                            {group.name}
                          </span>
                          <span className="rounded-full border border-gold-500/25 bg-gold-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-600">
                            {group.products.length}
                          </span>
                        </div>
                      </td>
                    </tr>,
                    ...group.products.map((product) => (
                    <tr
                      key={product.id}
                      draggable={canReorder && !savingOrder}
                      onDragStart={() => setDraggedId(product.id)}
                      onDragEnd={() => {
                        setDraggedId(null)
                        setDragOverId(null)
                      }}
                      onDragOver={(e) => {
                        if (!canReorder) return
                        e.preventDefault()
                        setDragOverId(product.id)
                      }}
                      onDragLeave={() => {
                        if (dragOverId === product.id) setDragOverId(null)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        void handleDrop(product.id)
                      }}
                      className={`transition-colors ${
                        draggedId === product.id
                          ? 'opacity-50'
                          : dragOverId === product.id
                            ? 'bg-festive-50'
                            : 'hover:bg-slate-50'
                      }`}
                    >
                      {canReorder && (
                        <td className="px-2 py-3 text-slate-400">
                          <button
                            type="button"
                            aria-label={`Drag to reorder ${product.name}`}
                            className="cursor-grab rounded p-1 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 pl-2">
                          <img
                            src={getImageUrl(product.image_url)}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-medium text-slate-900">{product.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{product.brand || '—'}</td>
                      <td className="w-px whitespace-nowrap px-3 py-3 text-slate-600">
                        {formatPrice(resolveProductPrice(product)) || 'Enquire'}
                      </td>
                      <td className="w-px whitespace-nowrap px-3 py-3 text-slate-600">
                        {product.pieces != null ? product.pieces : '—'}
                      </td>
                      <td className="w-px whitespace-nowrap px-3 py-3">
                        {product.stock_quantity != null ? (
                          <span
                            className={
                              isLowStock(product)
                                ? 'font-semibold text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {product.stock_quantity}
                            {product.stock_alert_limit != null && (
                              <span className="text-slate-400"> / {product.stock_alert_limit}</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="w-px whitespace-nowrap px-3 py-3">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            product.is_available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.is_available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="w-px whitespace-nowrap px-3 py-3">
                        <div className="flex items-center gap-2">
                          {archiveFilter === 'active' ? (
                            <>
                              <button
                                onClick={() => setSaleProduct(product)}
                                className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Mark sold"
                              >
                                <ShoppingBag className="h-4 w-4" />
                              </button>
                              <Link
                                to={`/admin/products/${product.id}/edit`}
                                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-festive-500"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => setArchiveId(product.id)}
                                className="rounded p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                                title="Archive"
                              >
                                <Archive className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleRestore(product.id)}
                                className="rounded p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Restore"
                              >
                                <ArchiveRestore className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteId(product.id)}
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
                    )),
                  ])
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RecordSaleDialog
        open={!!saleProduct}
        productName={saleProduct?.name || ''}
        remaining={saleProduct?.stock_quantity ?? null}
        onConfirm={handleRecordSale}
        onCancel={() => setSaleProduct(null)}
        loading={recordingSale}
      />

      <ConfirmDialog
        open={clearAllOpen}
        title="Delete all products & categories"
        message="This will permanently delete EVERY product and EVERY category from your store. The catalogue will be empty until you import again. This cannot be undone. Continue?"
        confirmLabel="Delete everything"
        onConfirm={handleClearAll}
        onCancel={() => setClearAllOpen(false)}
        loading={clearingAll}
      />

      <ConfirmDialog
        open={!!archiveId}
        title="Archive Product"
        message="Archive this product? It will be hidden from the website but can be restored later."
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setArchiveId(null)}
        loading={archiving}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product Permanently"
        message="Permanently delete this archived product? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  )
}
