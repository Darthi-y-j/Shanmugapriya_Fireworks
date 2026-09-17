import { cn } from '@/lib/utils'

type AnimatedShapeDividerProps = {
  position: 'top' | 'bottom'
  /** Fill color for the wave layers */
  fill?: string
  className?: string
}

const WAVE_A =
  'M0,72 C240,28 480,96 720,52 C960,8 1200,88 1440,44 L2880,44 C3120,88 3360,8 3600,52 C3840,96 4080,28 4320,72 L4320,120 L0,120 Z'

const WAVE_B =
  'M0,88 C300,48 600,108 900,64 C1200,20 1500,96 1800,56 C2100,16 2400,92 2700,60 C3000,28 3300,100 3600,76 L3600,120 L0,120 Z'

const WAVE_C =
  'M0,64 C360,104 720,36 1080,80 C1440,124 1800,40 2160,84 C2520,128 2880,52 3240,92 C3600,132 3960,48 4320,88 L4320,120 L0,120 Z'

function WaveLayer({
  d,
  fill,
  opacity,
  animationClass,
  delay = '0s',
}: {
  d: string
  fill: string
  opacity: number
  animationClass: string
  delay?: string
}) {
  return (
    <svg
      viewBox="0 0 4320 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute left-0 h-full w-[300%] max-w-none', animationClass)}
      style={{ animationDelay: delay }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} fill={fill} opacity={opacity} />
    </svg>
  )
}

/** Layered wavy shape divider with continuous drift animation */
export function AnimatedShapeDivider({
  position,
  fill = '#ffffff',
  className,
}: AnimatedShapeDividerProps) {
  const isTop = position === 'top'

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-x-0 z-20 h-14 overflow-hidden sm:h-20 md:h-24',
        isTop ? 'top-0' : 'bottom-0',
        className,
      )}
      aria-hidden="true"
    >
      <div
        className={cn('relative h-full w-full', isTop ? 'rotate-180' : '')}
      >
        <WaveLayer d={WAVE_A} fill={fill} opacity={0.92} animationClass="animate-shape-wave-drift" />
        <WaveLayer
          d={WAVE_B}
          fill={fill}
          opacity={0.65}
          animationClass="animate-shape-wave-drift-reverse"
          delay="-3s"
        />
        <WaveLayer
          d={WAVE_C}
          fill={fill}
          opacity={0.4}
          animationClass="animate-shape-wave-drift"
          delay="-6s"
        />
      </div>
    </div>
  )
}
