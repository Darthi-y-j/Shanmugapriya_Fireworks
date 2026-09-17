import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { ProductLink } from '@/components/customer/ProductLink'
import { useProductCartState } from '@/hooks/useProductCartState'
import { getImageUrl, IMAGE_WIDTH } from '@/lib/utils'

export function HomePopularProductCard({ product }: { product: Product }) {
  const { price, handleAddToCart } = useProductCartState(product)
  const available = product.is_available

  return (
    <article className="flex h-full min-w-[200px] flex-col overflow-hidden rounded-2xl border border-[#062B63]/8 bg-[#FAF7F2] shadow-[0_8px_28px_rgba(6,43,99,0.08)] sm:min-w-0">
      <ProductLink product={product} className="block overflow-hidden rounded-t-2xl">
        <img
          src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
          alt=""
          className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </ProductLink>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-center">
        <ProductLink product={product}>
          <h3 className="line-clamp-2 font-display text-sm font-bold text-[#062B63] sm:text-[15px]">
            {product.name}
          </h3>
        </ProductLink>
        {price && (
          <p className="mt-1.5 text-sm font-semibold text-[#062B63]/80">{price}</p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!available}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C9A24A] px-4 py-2.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {available ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </article>
  )
}
