import { Link } from 'react-router-dom'
import type { ChatbotProduct } from '@/services/chatbotApi'
import { ProductImage } from '@/components/customer/ProductImage'
import { resolveProductPrice } from '@/lib/pricing'

interface ChatbotProductCardProps {
  product: ChatbotProduct
}

export function ChatbotProductCard({ product }: ChatbotProductCardProps) {
  const price = product.price ?? resolveProductPrice(product)
  const hasDiscount =
    product.discount_percentage != null && product.discount_percentage > 0

  return (
    <Link
      to={`/products/${product.slug}`}
      className="flex w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900/80 transition hover:border-gold-400/35"
    >
      <div className="aspect-square w-full overflow-hidden bg-white/5">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-0.5 p-2">
        <p className="font-product-name line-clamp-2 text-[11px] font-medium leading-tight text-cream-50">
          {product.name}
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {price != null && (
            <span className="text-[11px] font-semibold text-gold-400">₹{price}</span>
          )}
          {hasDiscount && (
            <span className="text-[9px] text-emerald-400">{product.discount_percentage}% off</span>
          )}
        </div>
        {product.is_available === false && (
          <span className="text-[9px] text-red-400/80">Out of stock</span>
        )}
      </div>
    </Link>
  )
}
