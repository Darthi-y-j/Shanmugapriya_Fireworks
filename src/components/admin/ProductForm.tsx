import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, Category } from '@/types/database'
import { slugify, formatPrice } from '@/lib/utils'
import { getNextSortOrder, getSortOrderConflictMessage } from '@/lib/sortOrder'
import {
  buildProductPricingPayload,
  formatPricingPreview,
  calculateDiscountedPrice,
  calculateOriginalFromSelling,
} from '@/lib/pricing'
import { createProduct, updateProduct } from '@/services/products'
import { ImageUploader } from './ImageUploader'
import { VideoUploader } from './VideoUploader'
import { useToast } from '@/contexts/ToastContext'
import { isValidYouTubeUrl } from '@/lib/youtube'
import { buildProductGalleryPayload, getInitialGallerySlots } from '@/lib/productImages'
import {
  SELL_UNITS,
  buildPackagingSpecifications,
  formatPackagingPreview,
  getInnerCountLabel,
  getPiecesPerLabel,
  getUnitsPerItemHelp,
  getUnitsPerItemLabel,
  hasNestedInnerUnit,
  parseOptionalPositiveInt,
  readPackagingFromSpecifications,
  specificationsToTextarea,
  type SellUnit,
} from '@/lib/packaging'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  existingProducts: Product[]
}

function formatMoneyInput(value: number): string {
  if (!Number.isFinite(value)) return ''
  return String(Math.round(value * 100) / 100)
}

function parseMoney(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = parseFloat(trimmed)
  if (Number.isNaN(parsed) || parsed < 0) return null
  return parsed
}

function getInitialPricing(product?: Product) {
  if (!product) {
    return { original_price: '', discount_percentage: '', selling_price: '' }
  }

  const discount = product.discount_percentage?.toString() || ''

  if (product.original_price != null) {
    const selling =
      product.price != null
        ? product.price
        : product.discount_percentage
          ? calculateDiscountedPrice(product.original_price, product.discount_percentage)
          : product.original_price
    return {
      original_price: product.original_price.toString(),
      discount_percentage: discount,
      selling_price: formatMoneyInput(selling),
    }
  }

  if (product.price != null) {
    return {
      original_price: product.price.toString(),
      discount_percentage: '',
      selling_price: product.price.toString(),
    }
  }

  return { original_price: '', discount_percentage: '', selling_price: '' }
}

export function ProductForm({ product, categories, existingProducts }: ProductFormProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const initialPricing = getInitialPricing(product)

  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category_id: product?.category_id || '',
    description: product?.description || '',
    original_price: initialPricing.original_price,
    discount_percentage: initialPricing.discount_percentage,
    selling_price: initialPricing.selling_price,
    image_url: product?.image_url || '',
    gallery_slots: getInitialGallerySlots(product),
    video_url: product?.video_url || '',
    youtube_url: product?.youtube_url || '',
    is_available: product?.is_available ?? true,
    is_recommended: product?.is_recommended ?? false,
    is_best_seller: product?.is_best_seller ?? false,
    sort_order:
      product?.sort_order?.toString() || getNextSortOrder(existingProducts).toString(),
    pieces: product?.pieces?.toString() || '',
    ...readPackagingFromSpecifications(product?.specifications),
    stock_quantity: product?.stock_quantity?.toString() || '',
    stock_alert_limit: product?.stock_alert_limit?.toString() || '',
    brand: product?.brand || '',
    specifications: specificationsToTextarea(product?.specifications),
  })

  const [pricingSource, setPricingSource] = useState<'original' | 'selling'>('original')

  const pricingPreview = useMemo(
    () => formatPricingPreview(form.original_price, form.discount_percentage, formatPrice),
    [form.original_price, form.discount_percentage]
  )

  const packagingPreview = useMemo(() => {
    return formatPackagingPreview({
      sellUnit: form.sell_unit,
      pieces: parseOptionalPositiveInt(form.pieces),
      unitsPerItem: parseOptionalPositiveInt(form.units_per_item),
      innerCount: parseOptionalPositiveInt(form.inner_count),
      innerUnitName: form.inner_unit_name,
    })
  }, [
    form.sell_unit,
    form.pieces,
    form.units_per_item,
    form.inner_count,
    form.inner_unit_name,
  ])

  const handleOriginalPriceChange = (value: string) => {
    setPricingSource('original')
    const original = parseMoney(value)
    const discount = parseMoney(form.discount_percentage) ?? 0
    setForm((prev) => ({
      ...prev,
      original_price: value,
      selling_price:
        original == null
          ? ''
          : formatMoneyInput(calculateDiscountedPrice(original, discount)),
    }))
  }

  const handleSellingPriceChange = (value: string) => {
    setPricingSource('selling')
    const selling = parseMoney(value)
    const discount = parseMoney(form.discount_percentage) ?? 0
    setForm((prev) => ({
      ...prev,
      selling_price: value,
      original_price:
        selling == null
          ? ''
          : formatMoneyInput(calculateOriginalFromSelling(selling, discount)),
    }))
  }

  const handleDiscountChange = (value: string) => {
    const discount = parseMoney(value) ?? 0
    setForm((prev) => {
      if (pricingSource === 'selling') {
        const selling = parseMoney(prev.selling_price)
        return {
          ...prev,
          discount_percentage: value,
          original_price:
            selling == null
              ? prev.original_price
              : formatMoneyInput(calculateOriginalFromSelling(selling, discount)),
        }
      }

      const original = parseMoney(prev.original_price)
      return {
        ...prev,
        discount_percentage: value,
        selling_price:
          original == null
            ? prev.selling_price
            : formatMoneyInput(calculateDiscountedPrice(original, discount)),
      }
    })
  }

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: product ? prev.slug : slugify(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sortOrder = parseInt(form.sort_order, 10)
    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      showToast('Enter a valid sort order (0 or higher).', 'error')
      return
    }

    const conflict = getSortOrderConflictMessage(existingProducts, sortOrder, product?.id)
    if (conflict) {
      showToast(conflict, 'error')
      return
    }

    let originalInput = form.original_price.trim()
    if (!originalInput && form.selling_price.trim()) {
      const selling = parseMoney(form.selling_price)
      const discount = parseMoney(form.discount_percentage) ?? 0
      if (selling != null) {
        originalInput = formatMoneyInput(calculateOriginalFromSelling(selling, discount))
      }
    }

    const pricing = buildProductPricingPayload(originalInput, form.discount_percentage)
    if (pricing.error) {
      showToast(pricing.error, 'error')
      return
    }

    let pieces: number | null = null
    if (form.sell_unit === 'piece') {
      pieces = null
    } else if (form.pieces.trim()) {
      const parsedPieces = parseOptionalPositiveInt(form.pieces)
      if (parsedPieces == null) {
        showToast('Enter a valid number of pieces (1 or higher), or leave blank.', 'error')
        return
      }
      pieces = parsedPieces
    }

    let unitsPerItem = 1
    if (form.sell_unit !== 'piece' && form.units_per_item.trim()) {
      const parsedUnits = parseOptionalPositiveInt(form.units_per_item)
      if (parsedUnits == null) {
        showToast('Enter a valid number of units per item (1 or higher).', 'error')
        return
      }
      unitsPerItem = parsedUnits
    }

    let innerCount: number | null = null
    if (hasNestedInnerUnit(form.sell_unit) && form.inner_count.trim()) {
      innerCount = parseOptionalPositiveInt(form.inner_count)
      if (innerCount == null) {
        showToast('Enter a valid inner count (1 or higher), e.g. 5 boxes per bundle.', 'error')
        return
      }
    }

    let stock_quantity: number | null = null
    if (form.stock_quantity.trim()) {
      const parsedStock = parseInt(form.stock_quantity, 10)
      if (Number.isNaN(parsedStock) || parsedStock < 0) {
        showToast('Enter a valid stock quantity (0 or higher), or leave blank.', 'error')
        return
      }
      stock_quantity = parsedStock
    }

    let stock_alert_limit: number | null = null
    if (form.stock_alert_limit.trim()) {
      const parsedLimit = parseInt(form.stock_alert_limit, 10)
      if (Number.isNaN(parsedLimit) || parsedLimit < 0) {
        showToast('Enter a valid stock alert limit (0 or higher), or leave blank.', 'error')
        return
      }
      stock_alert_limit = parsedLimit
    }

    if (form.youtube_url.trim() && !isValidYouTubeUrl(form.youtube_url)) {
      showToast('Enter a valid YouTube link (watch, shorts, or youtu.be URL).', 'error')
      return
    }

    setLoading(true)

    const specs: Record<string, string> = {}
    form.specifications.split('\n').forEach((line) => {
      const [key, ...rest] = line.split(':')
      if (key?.trim() && rest.length) {
        specs[key.trim()] = rest.join(':').trim()
      }
    })
    Object.assign(
      specs,
      buildPackagingSpecifications(
        form.sell_unit,
        unitsPerItem,
        innerCount,
        form.inner_unit_name,
      ),
    )

    const galleryPayload = buildProductGalleryPayload(form.gallery_slots)

    const payload = {
      name: form.name,
      slug: form.slug,
      category_id: form.category_id || null,
      description: form.description || null,
      price: pricing.price,
      original_price: pricing.original_price,
      discount_percentage: pricing.discount_percentage,
      pieces,
      stock_quantity,
      stock_alert_limit,
      brand: form.brand.trim() || null,
      image_url: galleryPayload.image_url,
      gallery_urls: galleryPayload.gallery_urls,
      video_url: form.video_url.trim() || null,
      youtube_url: form.youtube_url.trim() || null,
      is_available: form.is_available,
      is_featured: product?.is_featured ?? false,
      is_recommended: form.is_recommended,
      is_best_seller: form.is_best_seller,
      tag: product?.tag ?? null,
      sort_order: sortOrder,
      specifications: Object.keys(specs).length > 0 ? specs : null,
    }

    const result = product
      ? await updateProduct(product.id, payload)
      : await createProduct(payload)

    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast(product ? 'Product updated' : 'Product created', 'success')
      navigate('/admin/products')
    }

    setLoading(false)
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  const liveDiscount =
    form.original_price && form.discount_percentage
      ? calculateDiscountedPrice(
          parseFloat(form.original_price) || 0,
          parseFloat(form.discount_percentage) || 0
        )
      : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Product Name *</label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className={inputClass}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Brand</label>
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className={inputClass}
              placeholder="e.g. Standard, Sony, Local"
            />
            <p className="mt-1 text-xs text-slate-500">
              Brand or manufacturer name. Used for filtering on the shop page.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">Pricing</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.original_price}
                  onChange={(e) => handleOriginalPriceChange(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Discount %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.discount_percentage}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Selling Price (₹)
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.selling_price}
                onChange={(e) => handleSellingPriceChange(e.target.value)}
                className={inputClass}
                placeholder="e.g. 400"
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter original + discount, or selling + discount — the other price is calculated.
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Preview
              </p>
              {pricingPreview.selling ? (
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  {pricingPreview.hasDiscount && pricingPreview.original && (
                    <span className="text-sm text-slate-400 line-through">
                      {pricingPreview.original}
                    </span>
                  )}
                  <span className="text-xl font-bold text-festive-500">
                    {pricingPreview.selling}
                  </span>
                  {pricingPreview.hasDiscount && liveDiscount != null && !Number.isNaN(liveDiscount) && (
                    <span className="rounded-full bg-festive-500/10 px-2 py-0.5 text-xs font-semibold text-festive-600">
                      {form.discount_percentage}% OFF
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  Leave blank to show &quot;Enquire for price&quot; on the website.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-sm font-semibold text-slate-800">Packaging</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              What the customer buys and how it is packed inside (e.g. 1 bundle · 5 boxes · 10
              pcs/box).
            </p>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer buys (sell unit)
              </label>
              <select
                value={form.sell_unit}
                onChange={(e) =>
                  setForm({ ...form, sell_unit: e.target.value as SellUnit })
                }
                className={inputClass}
              >
                {SELL_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            {form.sell_unit !== 'piece' && (
              <>
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {getUnitsPerItemLabel(form.sell_unit)}
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.units_per_item}
                    onChange={(e) => setForm({ ...form, units_per_item: e.target.value })}
                    className={inputClass}
                    placeholder="1"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {getUnitsPerItemHelp(form.sell_unit)}
                  </p>
                </div>

                {hasNestedInnerUnit(form.sell_unit) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        {getInnerCountLabel(form.sell_unit, form.inner_unit_name)}
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={form.inner_count}
                        onChange={(e) => setForm({ ...form, inner_count: e.target.value })}
                        className={inputClass}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Inner unit name
                      </label>
                      <input
                        type="text"
                        value={form.inner_unit_name}
                        onChange={(e) => setForm({ ...form, inner_unit_name: e.target.value })}
                        className={inputClass}
                        placeholder="box"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {getPiecesPerLabel(form.sell_unit, form.inner_unit_name)}
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.pieces}
                    onChange={(e) => setForm({ ...form, pieces: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. 10"
                  />
                </div>
              </>
            )}

            <div className="mt-4 rounded-lg border border-amber-200/90 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-950">
              {packagingPreview}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">Stock &amp; alerts</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Available quantity
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 400"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Alert limit
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.stock_alert_limit}
                  onChange={(e) => setForm({ ...form, stock_alert_limit: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. 50"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Admin is alerted when remaining stock reaches this limit. Use Mark sold on the products list to reduce quantity.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Product images (1–3)</p>
            <p className="mt-1 text-xs text-slate-500">
              Image 1 is the main thumbnail in the shop. Add up to two more for the product detail carousel.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {form.gallery_slots.map((url, index) => (
                <ImageUploader
                  key={index}
                  bucket="product-images"
                  label={index === 0 ? 'Image 1 (main)' : `Image ${index + 1} (optional)`}
                  currentUrl={url}
                  onUpload={(uploadedUrl) =>
                    setForm((prev) => {
                      const gallery_slots = [...prev.gallery_slots] as [string, string, string]
                      gallery_slots[index] = uploadedUrl
                      return { ...prev, gallery_slots, image_url: gallery_slots[0] || '' }
                    })
                  }
                  onRemove={() =>
                    setForm((prev) => {
                      const gallery_slots = [...prev.gallery_slots] as [string, string, string]
                      gallery_slots[index] = ''
                      return { ...prev, gallery_slots, image_url: gallery_slots[0] || '' }
                    })
                  }
                />
              ))}
            </div>
          </div>

          <VideoUploader
            currentUrl={form.video_url}
            onUpload={(url) => setForm({ ...form, video_url: url })}
            onRemove={() => setForm({ ...form, video_url: '' })}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">YouTube link</label>
            <input
              type="url"
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Optional. Paste a YouTube watch, Shorts, or youtu.be link. You can add an upload and a YouTube link.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Specifications (one per line, format: Key: Value)
            </label>
            <textarea
              value={form.specifications}
              onChange={(e) => setForm({ ...form, specifications: e.target.value })}
              rows={4}
              className={inputClass}
              placeholder="Duration: 30 seconds&#10;Type: Aerial"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sort Order</label>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className={inputClass}
            />
            {!product && (
              <p className="mt-1 text-xs text-slate-500">
                Next available: {getNextSortOrder(existingProducts)}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-800">Product status & badges</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-festive-500"
                />
                Available
              </label>
              <label className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2.5 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_recommended}
                  onChange={(e) => setForm({ ...form, is_recommended: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-festive-500"
                />
                Recommended badge
              </label>
              <label className="flex items-center gap-2.5 rounded-lg border border-pink-200 bg-pink-50/50 px-3 py-2.5 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_best_seller}
                  onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-festive-500"
                />
                Best Seller badge (blinks)
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Recommended and Best Seller show as badges on product cards across the shop.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-festive-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-festive-400 disabled:opacity-60"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
