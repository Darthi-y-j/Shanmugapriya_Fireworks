import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { EmptyState } from '@/components/customer/EmptyState'
import {
  CartLikesHero,
  CartLikesPageShell,
  cartLikesHeroIconAccentClass,
  cartLikesHeroTitleCompactClass,
} from '@/components/customer/CartLikesHero'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { cn, formatPrice, getImageUrl, IMAGE_WIDTH } from '@/lib/utils'
import type { WishlistItem } from '@/types/database'

export function PrimeLikesPage() {
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
      <SEO title="Liked Products" description="Your saved favourite crackers." noIndex />
      <CartLikesPageShell>
      <CartLikesHero contentClassName="px-3 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-2">
            <Heart className={cn('h-6 w-6 fill-current', cartLikesHeroIconAccentClass)} />
            <h1 className={cartLikesHeroTitleCompactClass}>Liked Products</h1>
          </div>
          {items.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A24A] px-4 py-2 text-sm font-bold text-[#0F2847] hover:bg-[#D4B05A]"
              >
                <ShoppingCart className="h-4 w-4" />
                Add all to cart
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-full border border-[#062B63]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#062B63] shadow-sm backdrop-blur-sm hover:bg-white/90"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </CartLikesHero>
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10">
        {items.length === 0 ? (
          <EmptyState
            title="No liked products yet"
            description="Tap the heart on any product in the shop to save it here."
            action={
              <Link
                to="/products"
                className="inline-flex rounded-full bg-[#0F2847] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3D66]"
              >
                Browse products
              </Link>
            }
          />
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-3 rounded-xl border border-[#0F2847]/15 bg-white p-3 shadow-sm"
              >
                <img
                  src={getImageUrl(item.imageUrl, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-md border-2 border-[#0077B6] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-[#1A1A1A]">{item.productName}</p>
                  <p className="mt-1 text-sm font-bold text-[#0F2847]">
                    {item.price != null ? formatPrice(item.price) : 'Enquire'}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-[#0077B6] px-3 py-1.5 text-xs font-bold text-[#0F2847] hover:bg-[#0096D6]"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item.productName} from liked`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      </CartLikesPageShell>
    </>
  )
}
