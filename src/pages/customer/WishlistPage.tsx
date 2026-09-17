import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, Sparkles, ArrowRight, Package } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { TitleHighlight } from '@/components/customer/TitleHighlight'
import { WaveDivider } from '@/components/customer/WaveDivider'
import { ProductImage } from '@/components/customer/ProductImage'
import { PageHeaderBackground } from '@/components/customer/PageHeader'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice } from '@/lib/utils'
import type { WishlistItem } from '@/types/database'

function WishlistCard({
  item,
  index,
  onAddToCart,
  onRemove,
}: {
  item: WishlistItem
  index: number
  onAddToCart: (item: WishlistItem) => void
  onRemove: (productId: string) => void
}) {
  return (
    <AnimateIn animation="fade-up" delay={60 + index * 40} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-navy-900/8 bg-white shadow-[0_8px_32px_rgba(15,13,11,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/40 hover:shadow-[0_16px_48px_rgba(244,63,94,0.12)] sm:rounded-2xl">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-rose-400/10 blur-2xl transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />

        <Link to={`/products/${item.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-navy-950/5">
          <ProductImage
            src={item.imageUrl}
            alt={item.productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-200 backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px]">
            <Heart className="h-2.5 w-2.5 fill-rose-400 text-rose-400 sm:h-3 sm:w-3" />
            Liked
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <Link
            to={`/products/${item.slug}`}
            className="line-clamp-2 font-display text-sm font-semibold leading-snug text-navy-900 transition hover:text-festive-600 sm:text-base"
          >
            {item.productName}
          </Link>

          <p className="mt-1.5 font-display text-sm font-bold text-gold-600 sm:mt-2 sm:text-lg">
            {item.price != null ? formatPrice(item.price) : 'Price on request'}
          </p>

          <div className="mt-auto flex gap-1.5 pt-3 sm:gap-2 sm:pt-4">
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-festive-500 to-orange-600 px-2 py-2 text-[10px] font-bold text-white shadow-md shadow-orange-500/20 transition hover:brightness-110 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs"
              aria-label={`Add ${item.productName} to cart`}
            >
              <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden min-[400px]:inline sm:inline">Add to Cart</span>
              <span className="min-[400px]:hidden sm:hidden">Cart</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.productId)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-900/10 text-navy-700/45 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:h-10 sm:w-10 sm:rounded-xl"
              aria-label={`Remove ${item.productName} from liked`}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </article>
    </AnimateIn>
  )
}

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { setCartItem } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (item: WishlistItem) => {
    setCartItem({
      productId: item.productId,
      productName: item.productName,
      slug: item.slug,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    })
    showToast(`Added ${item.productName} to cart`, 'success')
  }

  const handleAddAllToCart = () => {
    for (const item of items) {
      setCartItem({
        productId: item.productId,
        productName: item.productName,
        slug: item.slug,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: 1,
      })
    }
    showToast(`Added ${items.length} item${items.length !== 1 ? 's' : ''} to cart`, 'success')
  }

  return (
    <>
      <SEO title="Liked Products" description="Your saved favourite fireworks and crackers." noIndex />

      <div className="bg-cream-50">
        <header className="relative overflow-visible border-b-2 border-[#0F2847] pb-0 pt-6 sm:pt-8">
          <PageHeaderBackground />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_-5%,rgba(244,63,94,0.14),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(245,158,11,0.12),transparent_50%)]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-cream-100/55">
              <Link to="/" className="transition hover:text-gold-300">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-cream-50">Liked Products</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 flex flex-col gap-6 pb-8 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:pb-10">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/45 bg-navy-950/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                    <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-100">
                      Your Favourites
              </span>
            </div>

                  <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] text-cream-50 sm:text-5xl">
                    Liked{' '}
                    <TitleHighlight variant="dark">Products</TitleHighlight>
            </h1>

                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream-50/90 sm:text-base">
                    Save crackers and fireworks you love — add them to cart anytime or keep browsing
                    for more festive picks.
                  </p>

                  {items.length > 0 && (
                    <div className="mt-6 flex max-w-[calc(100%-5rem)] flex-wrap gap-2 sm:max-w-none">
                      <span className="rounded-full border border-white/25 bg-navy-950/85 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md">
                        {items.length} saved item{items.length !== 1 ? 's' : ''}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/50 bg-navy-950/85 px-3 py-1.5 text-xs font-bold text-gold-300 shadow-md backdrop-blur-md">
                        <Sparkles className="h-3 w-3 shrink-0 text-gold-400" />
                        Ready to order
                      </span>
                    </div>
                  )}
          </div>

                {items.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={handleAddAllToCart}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-500 px-4 py-2.5 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/25 transition hover:brightness-110"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add all to cart
                    </button>
          <button
            type="button"
            onClick={clearWishlist}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-navy-950/80 px-4 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition hover:border-red-400/50 hover:text-red-200"
          >
                      <Trash2 className="h-4 w-4" />
            Clear all
          </button>
        </div>
                )}
              </div>
            </AnimateIn>
          </div>

          <WaveDivider />
        </header>

        <section className="relative -mt-1 pb-14 pt-4 sm:pb-16 sm:pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <AnimateIn animation="fade-up">
                <div className="relative overflow-hidden rounded-3xl border border-navy-900/8 bg-white px-6 py-14 text-center shadow-[0_16px_48px_rgba(15,13,11,0.08)] sm:px-12 sm:py-16">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(244,63,94,0.08),transparent_65%)]"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-white shadow-inner">
                      <Heart className="h-10 w-10 fill-rose-200 text-rose-400" />
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-bold text-navy-900">
                      No liked products yet
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-700/65">
                      Tap the heart on any product while browsing — your favourites will appear here
                      so you can come back and order later.
                    </p>
                    <Link
                      to="/products"
                      className="btn-hover-lift mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-festive-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25"
                    >
                      <Package className="h-4 w-4" />
                      Browse Products
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => (
                  <WishlistCard
                    key={item.productId}
                    item={item}
                    index={index}
                    onAddToCart={handleAddToCart}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}

            {items.length > 0 && (
              <AnimateIn animation="fade-up" delay={200}>
                <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold-400/20 bg-navy-950 shadow-[0_16px_48px_rgba(15,13,11,0.15)] sm:mt-10">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_100%_0%,rgba(245,158,11,0.15),transparent_55%)]"
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400/80">
                        Keep exploring
                      </p>
                      <h3 className="mt-1 font-display text-xl font-bold text-cream-50 sm:text-2xl">
                        Discover more fireworks
                      </h3>
                      <p className="mt-2 max-w-md text-sm text-cream-100/65">
                        Browse categories, gift boxes, and premium collections to find your next
                        favourite.
                      </p>
                    </div>
                    <Link
                      to="/products"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gold-400/35 bg-gold-500/15 px-5 py-2.5 text-sm font-bold text-gold-300 transition hover:bg-gold-500/25"
                    >
                      View catalogue
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            )}
        </div>
        </section>
      </div>
    </>
  )
}
