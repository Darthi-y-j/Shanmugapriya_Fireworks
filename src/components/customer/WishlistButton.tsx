import { Heart } from 'lucide-react'
import type { Product } from '@/types/database'
import { cn } from '@/lib/utils'
import { useWishlistItem } from '@/contexts/WishlistContext'
import { toggleWishlistItem } from '@/lib/wishlistStore'
import { useToast } from '@/contexts/ToastContext'

interface WishlistButtonProps {
  product: Product
  className?: string
  iconClassName?: string
  size?: 'xs' | 'sm' | 'md'
}

export function WishlistButton({
  product,
  className,
  iconClassName,
  size = 'md',
}: WishlistButtonProps) {
  const liked = useWishlistItem(product.id)
  const { showToast } = useToast()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleWishlistItem(product)
    showToast(
      added ? `Added ${product.name} to liked` : `Removed ${product.name} from liked`,
      added ? 'success' : 'info',
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={liked ? 'Remove from liked' : 'Add to liked'}
      aria-pressed={liked}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        size === 'xs' ? 'h-7 w-7' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        className,
      )}
    >
      <Heart
        className={cn(
          size === 'xs' ? 'h-3.5 w-3.5' : size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          liked ? 'fill-red-500 text-red-500' : cn('text-red-500', iconClassName),
        )}
      />
    </button>
  )
}
