import type { CSSProperties } from 'react'

/** Delicate line-art SVG illustrations for heritage parallax layers */

export function MandalaLarge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="240" cy="240" r="220" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="240" cy="240" r="180" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
      <circle cx="240" cy="240" r="140" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="240" cy="240" r="100" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180
        return (
          <line
            key={i}
            x1={240 + 60 * Math.cos(a)}
            y1={240 + 60 * Math.sin(a)}
            x2={240 + 220 * Math.cos(a)}
            y2={240 + 220 * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="0.4"
            opacity="0.35"
          />
        )
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180
        const cx = 240 + 160 * Math.cos(a)
        const cy = 240 + 160 * Math.sin(a)
        return (
          <circle key={`p-${i}`} cx={cx} cy={cy} r="18" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
        )
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180
        const r = 80 + (i % 3) * 20
        const cx = 240 + r * Math.cos(a)
        const cy = 240 + r * Math.sin(a)
        return <circle key={`d-${i}`} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="0.25" />
      })}
      <path
        d="M240 40 C280 80 320 120 360 160 C320 200 280 240 240 280 C200 240 160 200 120 160 C160 120 200 80 240 40Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <path
        d="M240 440 C200 400 160 360 120 320 C160 280 200 240 240 200 C280 240 320 280 360 320 C320 360 280 400 240 440Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  )
}

export function MandalaSmall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.4" opacity="0.3" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180
        return (
          <line
            key={i}
            x1={100 + 20 * Math.cos(a)}
            y1={100 + 20 * Math.sin(a)}
            x2={100 + 90 * Math.cos(a)}
            y2={100 + 90 * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="0.35"
            opacity="0.3"
          />
        )
      })}
    </svg>
  )
}

export function TempleLineArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Gopuram */}
      <path
        d="M260 20 L275 55 L295 48 L285 75 L310 82 L285 90 L295 115 L275 108 L260 140 L245 108 L225 115 L235 90 L210 82 L235 75 L225 48 L245 55 L260 20Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <path d="M180 140 H340 V155 H180Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M195 155 V240 H225 V155 M245 155 V240 H275 V155 M295 155 V200 H325 V155" stroke="currentColor" strokeWidth="0.7" opacity="0.45" />
      <path d="M170 240 H350 V252 H170Z" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M160 252 H360 V265 H160Z" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Side shrines */}
      <path d="M120 160 V230 H155 V160 M155 160 L137 130 L120 160" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <path d="M400 160 V230 H365 V160 M365 160 L383 130 L400 160" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      {/* Palm trees */}
      <path d="M60 200 C55 170 50 150 45 130 C52 145 58 160 60 175" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      <path d="M60 200 V250" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      <path d="M460 195 C465 165 470 145 475 125 C468 140 462 155 460 170" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      <path d="M460 195 V248" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
      {/* Ground line */}
      <path d="M40 268 H480" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

export function FireworkBurst({
  className,
  size = 80,
  rays = 12,
  style,
}: {
  className?: string
  size?: number
  rays?: number
  style?: CSSProperties
}) {
  const half = size / 2
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: rays }, (_, i) => {
        const a = (i * (360 / rays) * Math.PI) / 180
        const len = half * 0.85
        return (
          <line
            key={i}
            x1={half}
            y1={half}
            x2={half + len * Math.cos(a)}
            y2={half + len * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        )
      })}
      <circle cx={half} cy={half} r="3" fill="currentColor" />
    </svg>
  )
}
