import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/types/database'
import { getImageUrl } from '@/lib/utils'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const description = category.description?.trim() || 'Explore our curated collection of premium fireworks.'

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-festive-500/10 bg-[#12100e] shadow-[0_0_0_1px_rgba(234,88,12,0.08),0_12px_40px_rgba(0,0,0,0.45)] transition-[box-shadow,border-color] duration-300 hover:border-festive-500/25 hover:shadow-[0_0_24px_rgba(234,88,12,0.12),0_16px_48px_rgba(0,0,0,0.5)] lg:min-h-[210px] lg:flex-row"
    >
      {/* Image */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden sm:h-36 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%]">
        <img
          src={getImageUrl(category.image_url, '/placeholder-category.svg')}
          alt={category.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12100e] via-[#12100e]/35 to-transparent transition-opacity duration-300 group-hover:opacity-90 lg:bg-gradient-to-r lg:from-[#12100e] lg:via-[#12100e]/60 lg:to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="relative z-[1] flex flex-1 flex-col justify-center p-3 sm:p-5 lg:max-w-[58%] lg:p-6">
        <div>
          <h3 className="font-display text-sm font-bold leading-tight text-gold-400 sm:text-lg lg:text-[1.35rem]">
            {category.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-cream-100/55 sm:mt-2 sm:text-xs lg:line-clamp-4 lg:text-sm">
            {description}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-2.5 right-2.5 z-[2] sm:bottom-4 sm:right-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-festive-500 to-gold-500 shadow-[0_6px_20px_rgba(234,88,12,0.45)] transition-[transform,box-shadow] duration-300 group-hover:translate-x-0.5 group-hover:shadow-[0_8px_24px_rgba(234,88,12,0.55)] sm:h-10 sm:w-10">
          <ArrowRight className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
        </span>
      </div>
    </Link>
  )
}
