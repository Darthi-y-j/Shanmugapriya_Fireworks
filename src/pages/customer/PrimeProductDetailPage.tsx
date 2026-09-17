import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ChevronRight, Eye, Minus, Plus, ShoppingCart } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductLink } from '@/components/customer/ProductLink'
import { getProductBySlug, getProductsByCategory } from '@/services/products'
import { readProductLinkState, preloadProductImage } from '@/lib/productLink'
import { formatPrice, getImageUrl, IMAGE_WIDTH } from '@/lib/utils'
import { resolveProductPrice } from '@/lib/pricing'
import { getDisplayBrand } from '@/lib/brand'
import { SITE_NAME } from '@/lib/siteConfig'
import { useProductCartState } from '@/hooks/useProductCartState'
import type { Product } from '@/types/database'

export function PrimeProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const previewProduct = readProductLinkState(location.state)
  const hasPreview = previewProduct?.slug === slug

  const [product, setProduct] = useState<Product | null>(hasPreview ? previewProduct : null)
  const [related, setRelated] = useState<Product[]>([])
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
        if (data?.category_id) {
          getProductsByCategory(data.category_id)
            .then((relatedProducts) => {
              setRelated(relatedProducts.filter((p) => p.id !== data.id).slice(0, 4))
            })
            .catch(() => setRelated([]))
        } else {
          setRelated([])
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

      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10">
        <nav className="mb-5 flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#0F2847]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-[#0F2847]">
            Shop
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-semibold text-[#0F2847]">{product.name}</span>
        </nav>

        <PrimeProductView product={product} />

        {related.length > 0 && (
          <div className="mt-10" data-reveal>
            <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-[#0F2847]">
              Related products
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductLink
                    product={item}
                    className="flex gap-3 rounded-xl border border-[#0F2847]/15 bg-white p-3 shadow-sm hover:border-[#0077B6]"
                  >
                    <img
                      src={getImageUrl(item.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-md border-2 border-[#0077B6] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#1A1A1A]">{item.name}</p>
                      <p className="mt-1 text-sm font-extrabold text-[#0077B6]">
                        {formatPrice(resolveProductPrice(item)) ?? 'Enquire'}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#0F2847]">
                        <Eye className="h-3 w-3" />
                        View
                      </span>
                    </div>
                  </ProductLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  )
}

function PrimeProductView({ product }: { product: Product }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const brand = getDisplayBrand(product.brand)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const specs = product.specifications
    ? Object.entries(product.specifications).filter(([, value]) => value?.trim())
    : []

  const specsPanel = specs.length > 0 ? (
    <div className="overflow-hidden rounded-lg border border-[#0F2847]/15 lg:h-full">
      <div className="border-b border-[#0077B6]/25 bg-[#FFF8E1]/70 px-3 py-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#0F2847]">
          Specifications
        </h2>
      </div>
      <dl className="divide-y divide-slate-100">
        {specs.map(([key, value]) => (
          <div key={key} className="bg-white px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{key}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  ) : null

  return (
    <div
      data-reveal="scale-in"
      className={`grid gap-6 rounded-xl border-2 border-[#0F2847]/15 bg-white p-4 shadow-md sm:p-6 ${
        specs.length > 0
          ? 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,14rem)]'
          : 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]'
      }`}
    >
      <img
        src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.detail)}
        alt={product.name}
        className="aspect-square w-full rounded-lg border-2 border-[#0077B6] object-cover"
      />

      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold text-[#0F2847]">{product.name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-2">
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

        <dl className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {brand && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Brand</dt>
              <dd>
                <span className="inline-block max-w-full truncate border-y-2 border-[#0077B6] px-1 py-0.5 text-sm font-bold text-[#0F2847]">
                  {brand}
                </span>
              </dd>
            </div>
          )}
          {product.pieces != null && (
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Pcs</dt>
              <dd className="font-semibold text-[#1A1A1A]">{product.pieces}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4">
          <span className="text-2xl font-extrabold text-[#0077B6]">{price ?? 'Enquire'}</span>
          {originalPrice && (
            <span className="ml-2 text-sm text-slate-400 line-through">{originalPrice}</span>
          )}
        </div>

        {product.description?.trim() && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
        )}

        {specsPanel && <div className="mt-5 lg:hidden">{specsPanel}</div>}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <WishlistButton
            product={product}
            className="h-11 w-11 rounded-md border border-[#0F2847]/15 bg-white"
          />
          {!product.is_available && !inCart ? (
            <span className="inline-flex h-11 items-center rounded-md bg-slate-100 px-4 text-sm font-semibold text-slate-500">
              Sold out
            </span>
          ) : (
            <div className="inline-flex h-11 overflow-hidden rounded-md border border-[#0F2847]/20 bg-white">
              <button
                type="button"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={!inCart}
                className="flex w-11 items-center justify-center text-[#0F2847] hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex min-w-[2.5rem] items-center justify-center border-x border-[#0F2847]/15 text-sm font-bold tabular-nums">
                {inCart ? quantity : 0}
              </span>
              <button
                type="button"
                onClick={inCart ? () => handleQuantityChange(quantity + 1) : handleAddToCart}
                className="flex min-w-11 items-center justify-center gap-1.5 bg-[#0F2847] px-3 text-sm font-bold text-white hover:bg-[#1A3D66]"
                aria-label={inCart ? 'Increase quantity' : 'Add to cart'}
              >
                {inCart ? <Plus className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                {!inCart && <span>Add</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {specsPanel && <div className="hidden min-w-0 lg:block">{specsPanel}</div>}
    </div>
  )
}
