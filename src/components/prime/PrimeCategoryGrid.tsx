import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { isSupabaseConfigured } from '@/lib/supabase'
import { getImageUrl, IMAGE_WIDTH } from '@/lib/utils'
import { MOCKUP_CATEGORIES } from '@/lib/mockupCategories'
import { warmupProductsPage } from '@/lib/prefetchProductsRoute'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import type { Category } from '@/types/database'

const AUTO_SCROLL_SPEED = 0.55

type DisplayCategory = {
  id: string
  name: string
  image: string
}

function toDisplayCategory(cat: Category): DisplayCategory {
  return {
    id: cat.id,
    name: cat.name,
    image: cat.image_url
      ? getImageUrl(
          cat.image_url,
          '/placeholder-category.svg',
          IMAGE_WIDTH.card,
          IMAGE_WIDTH.card,
          'cover',
        )
      : '/placeholder-category.svg',
  }
}

function CategoryShowcaseCard({
  cat,
  onCategory,
}: {
  cat: DisplayCategory
  onCategory: (categoryId: string) => void
}) {
  return (
    <article className="w-[150px] shrink-0 sm:w-[220px] lg:w-[240px]">
      <Link
        to="/products"
        onClick={(event) => {
          event.preventDefault()
          warmupProductsPage()
          onCategory(cat.id)
        }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DFD0] bg-[#FFFCF7] shadow-[0_4px_24px_rgba(15,40,71,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(15,40,71,0.1)]"
        aria-label={`Browse ${cat.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-[#F3EDE3]">
          <img
            src={cat.image}
            alt=""
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative flex items-center justify-between gap-1.5 overflow-hidden border-t border-[#C9A24A]/20 bg-gradient-to-br from-[#FFFCF7] via-[#FAF4EA] to-[#F3EDE3] px-2.5 py-2 transition duration-300 group-hover:border-[#0077B6]/25 group-hover:from-[#FFF8E8]/50 group-hover:to-[#FFFCF7] sm:gap-2 sm:px-4 sm:py-3.5">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A24A]/50 to-transparent"
            aria-hidden="true"
          />
          <div className="relative min-w-0 flex-1 pl-3">
            <span
              className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-full bg-gradient-to-b from-[#C9A24A] via-[#0077B6] to-[#C9A24A]/50"
              aria-hidden="true"
            />
            <p className="font-display text-[11px] font-bold leading-snug text-[#0F2847] transition duration-300 group-hover:text-[#0077B6] sm:text-[15px]">
              {cat.name}
            </p>
            <span
              className="mt-1 block h-0.5 w-5 rounded-full bg-gradient-to-r from-[#C9A24A] to-[#0077B6]/30 transition-all duration-300 group-hover:w-11 sm:mt-1.5 sm:w-7"
              aria-hidden="true"
            />
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#0F2847]/45 sm:mt-1 sm:text-[9px] sm:tracking-[0.16em]">
              Explore range
            </p>
          </div>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0077B6]/35 bg-white text-[#0077B6] shadow-sm transition duration-300 group-hover:scale-105 group-hover:border-[#0077B6] group-hover:bg-[#0077B6] group-hover:text-white sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </span>
        </div>
      </Link>
    </article>
  )
}

export function PrimeCategoryGrid() {
  const { scrollToCategory } = usePrimeShop()
  const sectionRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const visibleRef = useRef(true)
  const userScrollingRef = useRef(false)
  const autoScrollingRef = useRef(false)
  const userScrollTimeoutRef = useRef<number | undefined>(undefined)
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])

  useEffect(() => {
    void getCategories()
      .then((cats) => setCategories(cats))
      .catch(() => undefined)
  }, [])

  const displayCategories = useMemo((): DisplayCategory[] => {
    if (categories.length > 0) {
      return categories.map((cat) => toDisplayCategory(cat))
    }
    if (!isSupabaseConfigured) {
      return MOCKUP_CATEGORIES.map((c) => ({ id: c.id, name: c.name, image: c.image }))
    }
    return []
  }, [categories])

  const loopCategories = useMemo(
    () => [...displayCategories, ...displayCategories],
    [displayCategories],
  )

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const amount = direction === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.05, rootMargin: '80px 0px' },
    )
    visibilityObserver.observe(section)

    return () => visibilityObserver.disconnect()
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || displayCategories.length < 2) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (mq.matches || isTouchDevice) return

    let raf = 0
    let wheelTimeout = 0

    const normalizeLoop = () => {
      const loopPoint = el.scrollWidth / 2
      if (loopPoint > 0 && el.scrollLeft >= loopPoint) {
        el.scrollLeft -= loopPoint
      }
    }

    const tick = () => {
      if (visibleRef.current && !pausedRef.current && !userScrollingRef.current) {
        autoScrollingRef.current = true
        el.scrollLeft += AUTO_SCROLL_SPEED
        normalizeLoop()
        requestAnimationFrame(() => {
          autoScrollingRef.current = false
        })
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    const pause = () => {
      pausedRef.current = true
    }
    const resume = () => {
      pausedRef.current = false
    }

    const onUserScroll = () => {
      if (autoScrollingRef.current) return

      userScrollingRef.current = true
      window.clearTimeout(userScrollTimeoutRef.current)
      userScrollTimeoutRef.current = window.setTimeout(() => {
        userScrollingRef.current = false
        normalizeLoop()
      }, 1200)
    }

    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('focusin', pause)
    el.addEventListener('focusout', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume, { passive: true })
    const onWheel = () => {
      pause()
      window.clearTimeout(wheelTimeout)
      wheelTimeout = window.setTimeout(resume, 900)
    }

    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('scroll', onUserScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(userScrollTimeoutRef.current)
      window.clearTimeout(wheelTimeout)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('focusin', pause)
      el.removeEventListener('focusout', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onUserScroll)
    }
  }, [displayCategories.length])

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F7F3EC] py-6 sm:py-12 lg:py-14"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AnimateIn animation="fade-up" duration={700}>
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#0F2847]/60 sm:gap-3 sm:text-[10px] sm:tracking-[0.2em]">
                <span className="h-px w-6 bg-[#0F2847]/20 sm:w-8" aria-hidden="true" />
                Our Products
              </p>
              <h2
                id="categories-heading"
                className="mt-1.5 font-display text-xl font-bold leading-tight text-[#062B63] sm:mt-2 sm:whitespace-nowrap sm:text-[3.2rem] lg:text-[3.5rem]"
              >
                Explore Our{' '}
                <span className="about-hero-gradient-text">Categories</span>
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-snug text-slate-500 sm:mt-3 sm:text-base sm:leading-relaxed">
                A wide range of fireworks to make every celebration memorable.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={120} duration={700}>
            <div className="flex shrink-0 items-center gap-1.5 self-end sm:gap-2">
              <button
                type="button"
                onClick={() => scrollBy('left')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFD0] bg-[#FFFCF7] text-slate-500 shadow-sm transition hover:border-[#0077B6]/40 hover:text-[#0077B6] sm:h-10 sm:w-10"
                aria-label="Scroll categories left"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy('right')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077B6] text-white shadow-sm transition hover:bg-[#0096D6] sm:h-10 sm:w-10"
                aria-label="Scroll categories right"
              >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </AnimateIn>
        </div>

        <div className="relative mt-5 sm:mt-8 lg:mt-10">
          <div
            ref={scrollerRef}
            className="flex gap-2.5 overflow-x-auto pb-2 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Product categories carousel"
          >
            {loopCategories.map((cat, index) => (
              <CategoryShowcaseCard
                key={`${cat.id}-${index}`}
                cat={cat}
                onCategory={scrollToCategory}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
