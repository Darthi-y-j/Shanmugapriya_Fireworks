import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimateInProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'fade-down' | 'scale-in' | 'slide-left' | 'slide-in-left' | 'slide-in-right'
  delay?: number
  duration?: number
  once?: boolean
}

export function AnimateIn({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 450,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

    const isInViewport = () => {
      const rect = el.getBoundingClientRect()
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      return rect.top < viewHeight * 0.98 && rect.bottom > 0
    }

    if (isInViewport()) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 12% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={cn(!visible && 'opacity-0', visible && `animate-${animation}`, className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  )
}

interface StaggerGridProps {
  children: ReactNode
  className?: string
  stagger?: number
}

export function StaggerGrid({ children, className, stagger = 80 }: StaggerGridProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <AnimateIn key={i} delay={i * stagger} animation="fade-up">
              {child}
            </AnimateIn>
          ))
        : children}
    </div>
  )
}
