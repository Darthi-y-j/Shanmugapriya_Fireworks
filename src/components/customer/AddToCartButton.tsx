import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  productId: string
  productName: string
  slug: string
  imageUrl: string | null
  price: number | null
  quantity?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  variant?: 'primary' | 'outline'
}

export function AddToCartButton({
  productId,
  productName,
  slug,
  imageUrl,
  price,
  quantity = 1,
  className,
  size = 'md',
  fullWidth = false,
  variant = 'primary',
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart()
  const { showToast } = useToast()
  const inCart = isInCart(productId)

  const handleClick = () => {
    addItem({ productId, productName, slug, imageUrl, price }, quantity)
    showToast(`Added ${productName} to cart`, 'success')
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition',
        variant === 'primary'
          ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
          : 'border border-navy-800/20 text-navy-900 hover:bg-navy-800/5',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {inCart ? 'Added — Add More' : 'Add to Cart'}
    </button>
  )
}
