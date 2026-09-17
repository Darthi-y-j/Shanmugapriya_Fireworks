import { useEffect, useRef, useState } from 'react'

function parseStatValue(raw: string): { target: number; suffix: string; prefix: string } {
  const match = raw.match(/^([^0-9]*)([0-9.]+)([^0-9]*)$/)
  if (!match) return { prefix: '', target: 0, suffix: raw }
  return {
    prefix: match[1],
    target: Number(match[2]),
    suffix: match[3],
  }
}

export function useCountUp(
  displayValue: string,
  enabled = true,
  duration = 1400,
): string {
  const { prefix, target, suffix } = parseStatValue(displayValue)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!enabled || started.current || target === 0) {
      if (target === 0) setValue(0)
      return
    }
    started.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(target)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [enabled, target, duration])

  if (!enabled && target > 0) return displayValue
  if (target === 0) return displayValue
  return `${prefix}${value}${suffix}`
}
