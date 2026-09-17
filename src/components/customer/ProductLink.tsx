import { Link, type LinkProps } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import type { Product } from '@/types/database'
import { productLinkProps } from '@/lib/productLink'
import { getScrollKey, saveScrollPosition } from '@/lib/scrollRestore'

type ProductLinkProps = Omit<LinkProps, 'to' | 'state'> & {
  product: Product
}

export function ProductLink({ product, onClick, ...props }: ProductLinkProps) {
  const { pathname, search } = useLocation()
  const linkProps = productLinkProps(product)

  return (
    <Link
      {...linkProps}
      {...props}
      onClick={(event) => {
        saveScrollPosition(getScrollKey(pathname, search), window.scrollY)
        onClick?.(event)
      }}
    />
  )
}
