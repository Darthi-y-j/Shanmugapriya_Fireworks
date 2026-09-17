import { SEO } from '@/components/shared/SEO'
import { PrimeProductsPageHero } from '@/components/prime/PrimeProductsPageHero'
import { PrimeShopCatalog } from '@/components/prime/PrimeShopCatalog'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'

export function PrimeProductsPage() {
  return (
    <>
      <SEO
        title="Products"
        description={`Browse ${SHANMUGA_BRAND.displayName} fireworks — crackers, sparklers, fancy items and more. Add to cart and order via WhatsApp.`}
        url="/products"
      />

      <div className="relative bg-[#0F2847]">
        <PrimeProductsPageHero />
        <PrimeShopCatalog variant="page" />
      </div>
    </>
  )
}
