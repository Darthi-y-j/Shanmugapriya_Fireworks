/** Static wave — gentle S-curve with built-in gradient fill */
export const HERO_WAVE_VIEWBOX = '0 0 1440 100'

export const HERO_WAVE_CURVE = 'M0,52 C400,92 1000,12 1440,48'

export const HERO_WAVE_PATH = `${HERO_WAVE_CURVE} V100 H0 Z`

const WAVE_HEIGHT = 'h-20 sm:h-36 md:h-44'

function WaveSvg({
  fill,
  className = '',
  gradientId,
}: {
  fill?: string
  className?: string
  gradientId?: string
}) {
  return (
    <svg
      viewBox={HERO_WAVE_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block w-full max-w-none ${WAVE_HEIGHT} ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {gradientId && (
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="720"
            y1="12"
            x2="720"
            y2="100"
          >
            <stop offset="0%" stopColor="#0c0806" stopOpacity="0.55" />
            <stop offset="22%" stopColor="#1a100c" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#faf6ef" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#faf6ef" />
          </linearGradient>
        </defs>
      )}
      <path d={HERO_WAVE_PATH} fill={gradientId ? `url(#${gradientId})` : fill} />
    </svg>
  )
}

export function WaveDivider() {
  return (
    <div
      className="relative z-20 -mt-1 block w-full overflow-hidden leading-[0] sm:-mt-2 md:-mt-2"
      aria-hidden="true"
    >
      <WaveSvg gradientId="hero-wave-gradient-cream" />
    </div>
  )
}

/** Cream transition for catalogue pages */
export function WaveDividerWhite() {
  return (
    <div className="relative block w-full leading-[0]" aria-hidden="true">
      <svg
        viewBox={HERO_WAVE_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-12 w-full max-w-none sm:h-16"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={HERO_WAVE_PATH} fill="#ffffff" />
      </svg>
    </div>
  )
}

export function WaveDividerDark() {
  return (
    <div
      className={`relative block w-full overflow-hidden bg-navy-950 leading-[0] ${WAVE_HEIGHT}`}
      aria-hidden="true"
    >
      <WaveSvg fill="#1a100c" />
    </div>
  )
}
