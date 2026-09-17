import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Gift, LogIn, Sparkles, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'
import {
  SPIN_REWARDS,
  SPIN_ANIMATION_MS,
  describeWheelSegmentPath,
  getNextSpinRotation,
  getSegmentArcAngles,
  getSpinRewardMessage,
  pickSpinRewardForCartTotal,
  polarFromTop,
  type SpinReward,
} from '@/lib/spinToWin'

interface SpinToWinWheelProps {
  estimatedTotal: number
  reward: SpinReward | null
  onRewardChange?: (reward: SpinReward | null, discount: number) => void
  className?: string
}

const SPIN_EASING = 'cubic-bezier(0.2, 0.9, 0.2, 1)'

const WHEEL_SIZE = 288
const WHEEL_CENTER = WHEEL_SIZE / 2
const WHEEL_RADIUS = WHEEL_CENTER - 4
const LABEL_RADIUS = WHEEL_RADIUS * 0.62

function SpinCardShell({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-[#0F2847]/10 shadow-[0_12px_40px_rgba(0,77,85,0.12)]',
        className,
      )}
    >
      <OptimizedBackground src={SHANMUGA_BRAND.loginCardBg} priority />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.88)_35%,rgba(255,255,255,0.55)_100%)]"
        aria-hidden="true"
      />
      <div className={cn('relative', contentClassName)}>{children}</div>
    </div>
  )
}

function WheelSegments() {
  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      className="h-full w-full drop-shadow-[0_4px_20px_rgba(255,193,7,0.35)]"
      aria-hidden="true"
    >
      <defs>
        {SPIN_REWARDS.map((segment) => (
          <radialGradient
            key={segment.id}
            id={`spin-seg-${segment.id}`}
            cx={WHEEL_CENTER}
            cy={WHEEL_CENTER}
            r={WHEEL_RADIUS}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={segment.highlightColor} />
            <stop offset="45%" stopColor={segment.color} />
            <stop offset="100%" stopColor={segment.color} />
          </radialGradient>
        ))}
      </defs>
      {SPIN_REWARDS.map((segment) => {
        const { center } = getSegmentArcAngles(segment.segmentIndex)
        const labelPos = polarFromTop(WHEEL_CENTER, WHEEL_CENTER, LABEL_RADIUS, center)

        return (
          <g key={segment.id}>
            <path
              d={describeWheelSegmentPath(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, segment.segmentIndex)}
              fill={`url(#spin-seg-${segment.id})`}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1.25}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill={segment.textColor}
              fontSize={segment.label.length > 12 ? 7.5 : 8.5}
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${center}, ${labelPos.x}, ${labelPos.y})`}
              style={{ letterSpacing: '0.04em', paintOrder: 'stroke fill' }}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={0.4}
            >
              {segment.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function SpinToWinWheel({
  estimatedTotal,
  reward,
  onRewardChange,
  className,
}: SpinToWinWheelProps) {
  const { user, isCustomer, loading } = useAuth()
  const { showToast } = useToast()
  const [spinning, setSpinning] = useState(false)
  const rotationRef = useRef(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const pendingRewardRef = useRef<SpinReward | null>(null)
  const spinFinishTimerRef = useRef<number | null>(null)

  const applyWheelRotation = (degrees: number, animate: boolean) => {
    const wheel = wheelRef.current
    if (!wheel) return

    wheel.style.transition = animate
      ? `transform ${SPIN_ANIMATION_MS}ms ${SPIN_EASING}`
      : 'none'
    wheel.style.transform = `rotate(${degrees}deg)`
    rotationRef.current = degrees
  }

  useLayoutEffect(() => {
    applyWheelRotation(rotationRef.current, false)
  }, [])

  useEffect(() => {
    return () => {
      if (spinFinishTimerRef.current != null) {
        window.clearTimeout(spinFinishTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (reward) return

    pendingRewardRef.current = null
    rotationRef.current = 0
    applyWheelRotation(0, false)
  }, [reward])

  const finishSpin = (won: SpinReward) => {
    pendingRewardRef.current = null
    onRewardChange?.(won, 0)
    setSpinning(false)
    showToast(getSpinRewardMessage(won), 'success')
  }

  const handleSpin = () => {
    if (!user?.id || !isCustomer || spinning || reward) return

    const pickedReward = pickSpinRewardForCartTotal(estimatedTotal)
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const landingRotation = getNextSpinRotation(
      rotationRef.current,
      pickedReward.segmentIndex,
      extraSpins,
    )

    pendingRewardRef.current = pickedReward
    setSpinning(true)

    const wheel = wheelRef.current
    if (!wheel) return

    wheel.style.transition = 'none'
    wheel.style.transform = `rotate(${rotationRef.current}deg)`
    void wheel.offsetHeight

    wheel.style.transition = `transform ${SPIN_ANIMATION_MS}ms ${SPIN_EASING}`
    wheel.style.transform = `rotate(${landingRotation}deg)`
    rotationRef.current = landingRotation

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== wheel || event.propertyName !== 'transform') return
      wheel.removeEventListener('transitionend', onTransitionEnd)
      if (spinFinishTimerRef.current != null) {
        window.clearTimeout(spinFinishTimerRef.current)
        spinFinishTimerRef.current = null
      }
      const won = pendingRewardRef.current
      if (won) finishSpin(won)
    }

    wheel.addEventListener('transitionend', onTransitionEnd)

    if (spinFinishTimerRef.current != null) {
      window.clearTimeout(spinFinishTimerRef.current)
    }
    spinFinishTimerRef.current = window.setTimeout(() => {
      wheel.removeEventListener('transitionend', onTransitionEnd)
      const won = pendingRewardRef.current
      if (won) finishSpin(won)
    }, SPIN_ANIMATION_MS + 150)
  }

  if (loading) {
    return (
      <SpinCardShell className={className} contentClassName="p-6">
        <div className="h-48 animate-pulse rounded-2xl bg-[#0F2847]/5" />
      </SpinCardShell>
    )
  }

  if (!user || !isCustomer) {
    return (
      <SpinCardShell className={className} contentClassName="p-6">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0077B6]/40 bg-white/75">
            <Gift className="h-7 w-7 text-[#E6AC00]" />
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#E6AC00]">Premium</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#0F2847]">Spin to Win</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#0F2847]/75">
            Log in to spin the wheel and win a free gift with your order before you send your WhatsApp enquiry.
          </p>
          <Link
            to="/login"
            state={{ from: '/cart' }}
            className="btn-hover-lift mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0F2847] to-[#1A3D66] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0F2847]/25 transition hover:from-[#1A3D66] hover:to-[#00838f]"
          >
            <LogIn className="h-4 w-4" />
            Login to Spin
          </Link>
        </div>
      </SpinCardShell>
    )
  }

  return (
    <SpinCardShell className={className} contentClassName="p-5 sm:p-6">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="w-full shrink-0 text-center lg:max-w-[220px] lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0077B6]/45 bg-white/75 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#E6AC00]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#0F2847]">Premium</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-[#0F2847] sm:text-[1.75rem]">Spin to Win</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#0F2847]/75">
            One spin per enquiry. Win a free gift for this order — included with your WhatsApp message.
          </p>
          {reward && (
            <div className="mt-4 rounded-2xl border border-[#0F2847]/12 bg-white/85 px-4 py-3 text-left shadow-sm">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#E6AC00]">
                <Trophy className="h-3.5 w-3.5" />
                Your gift
              </p>
              <p className="mt-1 font-display text-lg font-bold text-[#0F2847]">{reward.label}</p>
              <p className="mt-1 text-xs text-[#0F2847]/70">{getSpinRewardMessage(reward)}</p>
            </div>
          )}
        </div>

        <div className="relative mx-auto flex h-[min(72vw,17rem)] w-[min(72vw,17rem)] items-center justify-center sm:h-72 sm:w-72">
          <div
            className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
            aria-hidden="true"
          >
            <div className="h-0 w-0 border-x-[12px] border-x-transparent border-b-[22px] border-b-[#0F2847] drop-shadow-[0_2px_6px_rgba(0,77,85,0.45)] sm:border-x-[14px] sm:border-b-[26px]" />
          </div>

          <div className="absolute inset-0 rounded-full border-[6px] border-[#0077B6] shadow-[0_0_0_3px_rgba(255,255,255,0.9),0_0_28px_rgba(255,193,7,0.55),0_0_48px_rgba(0,188,212,0.2)]" />

          <div
            ref={wheelRef}
            className={cn(
              'relative h-full w-full origin-center rounded-full',
              spinning && 'pointer-events-none',
            )}
          >
            <WheelSegments />
          </div>

          <button
            type="button"
            onClick={handleSpin}
            disabled={spinning || Boolean(reward)}
            aria-label={
              spinning ? 'Spinning the wheel' : reward ? 'Spin complete' : 'Spin the wheel'
            }
            className={cn(
              'absolute inset-[28%] z-30 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#0077B6]/75 bg-white shadow-[0_4px_18px_rgba(0,77,85,0.18),inset_0_0_0_4px_rgba(255,255,255,0.9)] transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100',
              spinning && 'pointer-events-none',
              reward && 'opacity-95',
            )}
          >
            <img
              src={SITE_LOGO_PATH}
              alt="Shanmuga Priya Crackers"
              className={cn(
                'relative z-10 h-[82%] w-[82%] object-contain',
                spinning && 'opacity-75',
              )}
            />
            {spinning && (
              <span
                className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#0077B6] border-r-[#0F2847] animate-spin"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </SpinCardShell>
  )
}
