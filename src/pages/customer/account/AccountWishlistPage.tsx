import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AccountPageHeader, accountContentClass } from '@/components/customer/account/AccountUI'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice, getImageUrl } from '@/lib/utils'

export function AccountWishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { setCartItem } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (item: (typeof items)[0]) => {
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

  return (
    <>
      <SEO title="Wishlist" description="Your saved favourite crackers and fireworks." noIndex />

      <AccountPageHeader backTo="/account" subtitle="Wishlist" />

      <div className={accountContentClass}>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy-900/15 bg-white p-8 text-center">
            <Heart className="mx-auto h-10 w-10 text-red-300" />
            <p className="mt-3 text-sm text-navy-700/60">No saved products yet.</p>
            <Link
              to="/products"
              className="mt-4 inline-block rounded-lg bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-400"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-navy-700/60">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-navy-700/50 hover:text-red-500"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-navy-900/10 bg-white p-4 shadow-sm"
                >
                  <Link to={`/products/${item.slug}`} className="shrink-0">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.slug}`}
                      className="line-clamp-2 text-sm font-semibold text-navy-900 hover:text-gold-700"
                    >
                      {item.productName}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-gold-700">
                      {formatPrice(item.price) ?? 'Price on request'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-navy-900 px-3 py-1.5 text-[11px] font-bold text-gold-300 hover:bg-navy-800"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex items-center gap-1 rounded-lg border border-navy-900/10 px-3 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
