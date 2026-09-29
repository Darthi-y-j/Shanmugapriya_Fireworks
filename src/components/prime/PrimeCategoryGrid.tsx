import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { getCachedCatalogueCategories } from '@/lib/catalogueCache'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import { getCategoryImageUrl } from '@/lib/utils'
import { MOCKUP_CATEGORIES } from '@/lib/mockupCategories'
import { warmupProductsPage } from '@/lib/prefetchProductsRoute'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import type { Category } from '@/types/database'

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
      ? getCategoryImageUrl(cat.image_url, '/placeholder-category.svg')
      : '/placeholder-category.svg',
  }
}

/** Shrink title on narrow cards so long names stay on one line. */
function categoryTitleClass(name: string): string {
  const base =
    'font-display font-bold leading-tight text-white whitespace-nowrap transition duration-300 group-hover:text-[#F5D78E]'
  const len = name.length
  if (len > 24) return `${base} text-[7px] sm:text-[10px] lg:text-[11px]`
  if (len > 18) return `${base} text-[8px] sm:text-[11px] lg:text-[12px]`
  if (len > 14) return `${base} text-[9px] sm:text-[12px] lg:text-[13px]`
  if (len > 10) return `${base} text-[10px] sm:text-[13px] lg:text-[14px]`
  return `${base} text-[11px] sm:text-[15px]`
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
          const viewport = (event.currentTarget.closest('[data-category-marquee]') as HTMLElement | null)
          if (viewport?.dataset.dragging === '1') {
            event.preventDefault()
            return
          }
          event.preventDefault()
          warmupProductsPage()
          onCategory(cat.id)
        }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-[#C9A24A]/35 bg-[#0F2847] shadow-[0_4px_24px_rgba(15,40,71,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A24A]/55 hover:shadow-[0_8px_32px_rgba(15,40,71,0.35)]"
        aria-label={`Browse ${cat.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-[#1A3D66] ring-1 ring-inset ring-white/10">
          <img
            src={cat.image}
            alt=""
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative flex items-center justify-between gap-1.5 overflow-hidden border-t border-[#C9A24A]/30 bg-gradient-to-br from-[#0F2847] via-[#132f52] to-[#0a1f38] px-2.5 py-2 transition duration-300 sm:gap-2 sm:px-4 sm:py-3.5">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A24A]/60 to-transparent"
            aria-hidden="true"
          />
          <div className="relative min-w-0 flex-1 overflow-hidden pl-3 pr-0.5">
            <span
              className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-full bg-gradient-to-b from-[#F5D78E] via-[#C9A24A] to-[#0077B6]/80"
              aria-hidden="true"
            />
            <p className={categoryTitleClass(cat.name)} title={cat.name}>
              {cat.name}
            </p>
            <span
              className="mt-1 block h-0.5 w-5 rounded-full bg-gradient-to-r from-[#C9A24A] to-[#0077B6]/50 transition-all duration-300 group-hover:w-11 sm:mt-1.5 sm:w-7"
              aria-hidden="true"
            />
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#F5D78E]/75 sm:mt-1 sm:text-[9px] sm:tracking-[0.16em]">
              Explore range
            </p>
          </div>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A24A]/50 bg-[#0F2847] text-[#F5D78E] shadow-sm transition duration-300 group-hover:scale-105 group-hover:border-[#F5D78E] group-hover:bg-[#C9A24A] group-hover:text-[#0F2847] sm:h-9 sm:w-9"
            aria-hidden="true"
          >
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </span>
        </div>
      </Link>
    </article>
  )
}

const CATEGORY_MARQUEE_PX_PER_FRAME = 0.55

function normalizeMarqueeOffset(offset: number, loopHalfWidth: number): number {
  if (loopHalfWidth <= 0) return offset
  let next = offset
  while (-next >= loopHalfWidth) next += loopHalfWidth
  while (next > 0) next -= loopHalfWidth
  return next
}

function getMarqueeStepPx(track: HTMLDivElement): number {
  const first = track.querySelector('article')
  if (!first) return 170
  const style = getComputedStyle(track)
  const gap = parseFloat(style.columnGap || style.gap || '10') || 10
  return first.getBoundingClientRect().width + gap
}

function applyMarqueeTransform(track: HTMLDivElement, offset: number) {
  track.style.transform = `translate3d(${offset}px,0,0)`
}

export function PrimeCategoryGrid() {
  const { scrollToCategory } = usePrimeShop()
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const loopHalfWidthRef = useRef(0)
  const userDraggingRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      const { getCategories } = await import('@/services/categories')
      const cats = await getCategories()
      setCategories(cats)
    }
    const run = () => void load().catch(() => undefined)
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(run, { timeout: 3000 })
    } else {
      setTimeout(run, 400)
    }
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

  useEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport || displayCategories.length === 0) return

    offsetRef.current = 0
    applyMarqueeTransform(track, 0)

    let raf = 0
    let dragStartX = 0
    let dragStartOffset = 0
    let activePointerId: number | null = null
    let dragEngaged = false
    const dragThresholdPx = 8

    const measure = () => {
      const half = track.scrollWidth / 2
      loopHalfWidthRef.current = half
      offsetRef.current = normalizeMarqueeOffset(offsetRef.current, half)
      applyMarqueeTransform(track, offsetRef.current)
    }

    measure()
    const resizeObserver =
      typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null
    resizeObserver?.observe(track)

    track.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true })
    })

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      activePointerId = event.pointerId
      dragEngaged = false
      dragStartX = event.clientX
      dragStartOffset = offsetRef.current
      viewport.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return
      const deltaX = event.clientX - dragStartX
      if (!dragEngaged && Math.abs(deltaX) < dragThresholdPx) return
      if (!dragEngaged) {
        dragEngaged = true
        userDraggingRef.current = true
        viewport.dataset.dragging = '1'
      }
      const half = loopHalfWidthRef.current
      offsetRef.current = dragStartOffset + deltaX
      offsetRef.current = normalizeMarqueeOffset(offsetRef.current, half)
      applyMarqueeTransform(track, offsetRef.current)
    }

    const endDrag = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return
      activePointerId = null
      userDraggingRef.current = false
      dragEngaged = false
      delete viewport.dataset.dragging
      try {
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId)
        }
      } catch {
        /* ignore */
      }
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)

    const tick = () => {
      if (loopHalfWidthRef.current <= 0) {
        measure()
      }
      const loopHalfWidth = loopHalfWidthRef.current
      if (loopHalfWidth > 0 && !userDraggingRef.current) {
        offsetRef.current -= CATEGORY_MARQUEE_PX_PER_FRAME
        offsetRef.current = normalizeMarqueeOffset(offsetRef.current, loopHalfWidth)
        applyMarqueeTransform(track, offsetRef.current)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver?.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
    }
  }, [displayCategories.length])

  const nudgeMarquee = useCallback((direction: 'left' | 'right') => {
    const track = trackRef.current
    if (!track) return
    const step = getMarqueeStepPx(track)
    const half = loopHalfWidthRef.current || track.scrollWidth / 2
    loopHalfWidthRef.current = half
    offsetRef.current += direction === 'left' ? step : -step
    offsetRef.current = normalizeMarqueeOffset(offsetRef.current, half)
    applyMarqueeTransform(track, offsetRef.current)
  }, [])

  return (
    <section
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
                onClick={() => nudgeMarquee('left')}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFD0] bg-[#FFFCF7] text-slate-500 shadow-sm transition hover:border-[#0077B6]/40 hover:text-[#0077B6] sm:h-10 sm:w-10"
                aria-label="Scroll categories left"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={() => nudgeMarquee('right')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077B6] text-white shadow-sm transition hover:bg-[#0096D6] sm:h-10 sm:w-10"
                aria-label="Scroll categories right"
              >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </AnimateIn>
        </div>

        <div className="relative mt-5 sm:mt-8 lg:mt-10">
          {displayCategories.length === 0 ? (
            <p className="text-center text-sm text-slate-500">Loading categories…</p>
          ) : (
            <div
              ref={viewportRef}
              data-category-marquee
              className="category-marquee featured-marquee cursor-grab touch-pan-y pb-2 active:cursor-grabbing"
              aria-label="Product categories carousel"
            >
              <div
                ref={trackRef}
                className="featured-marquee-track flex gap-2.5 sm:gap-4"
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
          )}
        </div>
      </div>
    </section>
  )
}
