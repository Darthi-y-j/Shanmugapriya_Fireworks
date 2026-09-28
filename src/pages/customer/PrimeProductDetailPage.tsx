import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Eye, Minus, Plus, ShoppingCart } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductLink } from '@/components/customer/ProductLink'
import { getProductBySlug, getRelatedProducts } from '@/services/products'
import { readProductLinkState, preloadProductImage } from '@/lib/productLink'
import { formatPrice, getImageUrl, IMAGE_WIDTH } from '@/lib/utils'
import { resolveProductPrice } from '@/lib/pricing'
import { getDisplayBrand } from '@/lib/brand'
import { CATALOG_INTERNAL_SPEC_KEYS } from '@/lib/packaging'
import { ProductCodeBadge } from '@/components/customer/ProductCodeBadge'
import { getProductCode } from '@/lib/productCode'
import { SITE_NAME } from '@/lib/siteConfig'
import { useProductCartState } from '@/hooks/useProductCartState'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import type { Product } from '@/types/database'

export function PrimeProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const { scrollToCategory } = usePrimeShop()
  const previewProduct = readProductLinkState(location.state)
  const hasPreview = previewProduct?.slug === slug

  const [product, setProduct] = useState<Product | null>(hasPreview ? previewProduct : null)
  const [related, setRelated] = useState<Product[]>([])
  const [relatedLoading, setRelatedLoading] = useState(true)
  const [loading, setLoading] = useState(!hasPreview)

  useEffect(() => {
    if (hasPreview && previewProduct) preloadProductImage(previewProduct.image_url)
  }, [hasPreview, previewProduct])

  useEffect(() => {
    async function load() {
      if (!slug) return
      const cachedPreview = readProductLinkState(location.state)
      const canShowPreview = cachedPreview?.slug === slug
      if (!canShowPreview) {
        setProduct(null)
        setLoading(true)
      }

      try {
        const data = await getProductBySlug(slug)
        setProduct(data)
        if (data) {
          setRelatedLoading(true)
          getRelatedProducts(data, 6)
            .then((items) => setRelated(items))
            .catch(() => setRelated([]))
            .finally(() => setRelatedLoading(false))
        } else {
          setRelated([])
          setRelatedLoading(false)
        }
      } catch {
        if (!canShowPreview) setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [slug, location.state])

  if (loading && !product) {
    return <LoadingState fullPage message="Loading product..." />
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed."
        action={
          <Link
            to="/products"
            className="rounded-full bg-[#0F2847] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3D66]"
          >
            Back to shop
          </Link>
        }
      />
    )
  }

  const priceText = formatPrice(resolveProductPrice(product))

  return (
    <>
      <SEO
        title={product.name}
        description={
          product.description?.trim() ||
          (priceText
            ? `${product.name} — ${priceText} at ${SITE_NAME}.`
            : `${product.name} at ${SITE_NAME}.`)
        }
        image={product.image_url || undefined}
        url={`/products/${slug}`}
        type="website"
      />

      <section className="mx-auto max-w-7xl px-4 py-5 pb-24 sm:px-6 sm:py-10 sm:pb-12">
        <nav
          className="mb-4 flex min-w-0 items-center gap-1 text-[11px] text-slate-500 sm:mb-5 sm:gap-1.5 sm:text-xs"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="shrink-0 hover:text-[#0F2847]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <Link to="/products" className="shrink-0 hover:text-[#0F2847]">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          <span className="min-w-0 truncate font-semibold text-[#0F2847]">{product.name}</span>
        </nav>

        <PrimeProductView product={product} />

        <div
          id="related-products"
          className="mt-8 scroll-mt-24 border-t border-[#0F2847]/10 pt-8 sm:mt-10"
          data-reveal
        >
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-[#0F2847] sm:text-lg">
              {product.category?.name
                ? `More in ${product.category.name}`
                : 'Related products'}
            </h2>
            {product.category_id && (
              <Link
                to="/products"
                onClick={() => scrollToCategory(product.category_id!)}
                className="text-xs font-bold text-[#0077B6] hover:underline sm:text-sm"
              >
                View all in shop
              </Link>
            )}
          </div>

          {relatedLoading ? (
            <p className="mt-4 text-sm text-slate-500">Loading related products…</p>
          ) : related.length > 0 ? (
            <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
              {related.map((item) => (
                <li key={item.id} className="w-[min(85vw,16rem)] shrink-0 sm:w-auto">
                  <ProductLink
                    product={item}
                    className="flex h-full gap-3 rounded-xl border border-[#0F2847]/15 bg-white p-3 shadow-sm hover:border-[#0077B6]"
                  >
                    <img
                      src={getImageUrl(item.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md border-2 border-[#0077B6] object-cover"
                    />
                    <div className="min-w-0">
                      <ProductCodeBadge product={item} size="xs" className="mb-1" />
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-[#1A1A1A]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#0077B6]">
                        {formatPrice(resolveProductPrice(item)) ?? 'Enquire'}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#0F2847]">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        View
                      </span>
                    </div>
                  </ProductLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-600">
              No other items in this category right now.{' '}
              <Link to="/products" className="font-bold text-[#0077B6] hover:underline">
                Browse the full shop
              </Link>
              .
            </p>
          )}
        </div>
      </section>
    </>
  )
}

function PrimeProductView({ product }: { product: Product }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const brand = getDisplayBrand(product.brand)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const hiddenSpecKeys = new Set<string>(CATALOG_INTERNAL_SPEC_KEYS)
  const specs = product.specifications
    ? Object.entries(product.specifications).filter(
        ([key, value]) => value?.trim() && !hiddenSpecKeys.has(key),
      )
    : []

  const specsPanel = (layout: 'sidebar' | 'grid') =>
    specs.length > 0 ? (
      <div
        className={
          layout === 'sidebar'
            ? 'overflow-hidden rounded-lg border border-[#0F2847]/15 lg:h-full'
            : 'overflow-hidden rounded-lg border border-[#0F2847]/15'
        }
      >
        <div className="border-b border-[#0077B6]/25 bg-[#FFF8E1]/70 px-3 py-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#0F2847]">
            Specifications
          </h2>
        </div>
        <dl
          className={
            layout === 'grid'
              ? 'grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3'
              : 'divide-y divide-slate-100'
          }
        >
          {specs.map(([key, value]) => (
            <div
              key={key}
              className={
                layout === 'grid'
                  ? 'bg-white px-2.5 py-2 sm:px-3 sm:py-2.5'
                  : 'bg-white px-3 py-2.5'
              }
            >
              <dt className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                {key}
              </dt>
              <dd className="mt-0.5 text-xs font-semibold leading-snug text-slate-800 sm:text-sm">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    ) : null

  const mobileSpecs = specs.length > 0 ? specsPanel('grid') : null
  const desktopSpecs = specs.length > 0 ? specsPanel('sidebar') : null

  const cartControls = (
    <>
      {!product.is_available && !inCart ? (
        <span className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-lg bg-slate-100 px-4 text-sm font-semibold text-slate-500">
          Sold out
        </span>
      ) : inCart ? (
        <div
          className="flex h-12 min-w-0 flex-1 overflow-hidden rounded-lg border border-[#0F2847]/20 bg-white"
          role="group"
          aria-label="Quantity in cart"
        >
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            className="flex w-11 shrink-0 items-center justify-center text-[#0F2847] hover:bg-slate-50"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="flex w-10 shrink-0 items-center justify-center border-x border-[#0F2847]/15 text-sm font-bold tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap bg-[#0F2847] px-3 text-sm font-bold text-white hover:bg-[#1A3D66]"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden min-[380px]:inline">More</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#0F2847] px-4 text-sm font-bold text-white hover:bg-[#1A3D66]"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Add to cart</span>
        </button>
      )}
    </>
  )

  return (
    <div
      data-reveal="scale-in"
      className={`grid max-w-full gap-4 overflow-hidden rounded-xl border-2 border-[#0F2847]/15 bg-white p-3 shadow-md sm:gap-6 sm:p-6 ${
        specs.length > 0
          ? 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,14rem)]'
          : 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]'
      }`}
    >
      <div className="mx-auto w-full max-w-[220px] sm:max-w-xs lg:mx-0 lg:max-w-none">
        <img
          src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.detail)}
          alt={product.name}
          className="aspect-square w-full rounded-lg border-2 border-[#0077B6] object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start gap-2 gap-y-1">
          <ProductCodeBadge product={product} size="sm" className="mt-0.5" />
          <h1 className="min-w-0 flex-1 font-display text-lg font-extrabold leading-snug text-[#0F2847] break-words sm:text-2xl">
            {product.name}
          </h1>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-3">
          {product.is_available ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              In stock
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              Sold out
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center rounded-md bg-[#0077B6] px-2.5 py-1 text-xs font-extrabold tabular-nums tracking-wide text-white shadow-sm">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mt-4">
          <span className="text-xl font-extrabold tabular-nums text-[#0077B6] sm:text-2xl">
            {price ?? 'Enquire'}
          </span>
          {originalPrice && (
            <span className="text-sm text-slate-400 line-through">{originalPrice}</span>
          )}
        </div>

        {(brand || product.pieces != null || getProductCode(product) !== '—') && (
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 sm:mt-4">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                Code
              </dt>
              <dd className="font-bold tabular-nums text-[#0077B6]">{getProductCode(product)}</dd>
            </div>
            {brand && (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                  Brand
                </dt>
                <dd>
                  <span className="inline-block max-w-full border-y-2 border-[#0077B6] px-1 py-0.5 text-sm font-bold text-[#0F2847]">
                    {brand}
                  </span>
                </dd>
              </div>
            )}
            {product.pieces != null && (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                  Pcs
                </dt>
                <dd className="font-semibold text-[#1A1A1A]">{product.pieces}</dd>
              </div>
            )}
          </dl>
        )}

        {mobileSpecs && <div className="mt-4 lg:hidden">{mobileSpecs}</div>}

        {product.description?.trim() && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
        )}

        <div className="mt-5 hidden items-center gap-2 sm:mt-6 sm:flex sm:flex-wrap">
          <WishlistButton
            product={product}
            className="h-11 w-11 shrink-0 rounded-md border border-[#0F2847]/15 bg-white"
          />
          {cartControls}
        </div>
      </div>

      {desktopSpecs && <div className="hidden min-w-0 lg:block">{desktopSpecs}</div>}

      {/* Mobile: full-width actions above cart bar */}
      <div className="flex min-w-0 max-w-full items-center gap-2 border-t border-slate-100 pt-4 sm:hidden lg:col-span-full lg:hidden">
        <WishlistButton
          product={product}
          className="h-12 w-12 shrink-0 rounded-lg border border-[#0F2847]/15 bg-white"
        />
        {cartControls}
      </div>
    </div>
  )
}
