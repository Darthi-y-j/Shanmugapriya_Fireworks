export type SpinRewardType =
  | 'tin_fountain'
  | 'helicopter'
  | 'one_k_wala'
  | 'single_pipe'
  | 'thirty_shot'
  | 'thirty_shot_plus_one_k'

export interface SpinReward {
  id: string
  label: string
  type: SpinRewardType
  segmentIndex: number
  /** Outer edge / base segment color */
  color: string
  /** Inner glow — fireworks burst centre */
  highlightColor: string
  textColor: string
}

export const SPIN_SEGMENT_COUNT = 6
export const SPIN_SEGMENT_DEGREES = 360 / SPIN_SEGMENT_COUNT
export const SPIN_ANIMATION_MS = 5000

/** Clockwise degrees from 12 o'clock to the centre of a wheel segment. */
export function getSegmentCenterAngle(segmentIndex: number): number {
  return segmentIndex * SPIN_SEGMENT_DEGREES + SPIN_SEGMENT_DEGREES / 2
}

export function normalizeWheelDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360
}

export const SPIN_REWARDS: SpinReward[] = [
  {
    id: 'tin_fountain',
    label: '4" TIN FOUNTAIN',
    type: 'tin_fountain',
    segmentIndex: 0,
    color: '#0077B6',
    highlightColor: '#FFF59D',
    textColor: '#0F2847',
  },
  {
    id: 'helicopter',
    label: 'HELICOPTER',
    type: 'helicopter',
    segmentIndex: 1,
    color: '#0F2847',
    highlightColor: '#1A3D66',
    textColor: '#FFF8E1',
  },
  {
    id: 'one_k_wala',
    label: '1K WALA',
    type: 'one_k_wala',
    segmentIndex: 2,
    color: '#1A3D66',
    highlightColor: '#4A6FA8',
    textColor: '#FFF8E1',
  },
  {
    id: 'single_pipe',
    label: '2" SINGLE PIPE',
    type: 'single_pipe',
    segmentIndex: 3,
    color: '#0096D6',
    highlightColor: '#F5E6B8',
    textColor: '#0A1F38',
  },
  {
    id: 'thirty_shot',
    label: '30 SHOT',
    type: 'thirty_shot',
    segmentIndex: 4,
    color: '#0A1F38',
    highlightColor: '#0F2847',
    textColor: '#0077B6',
  },
  {
    id: 'thirty_shot_plus_one_k',
    label: '30 SHOT + 1K',
    type: 'thirty_shot_plus_one_k',
    segmentIndex: 5,
    color: '#0077B6',
    highlightColor: '#FFF8E1',
    textColor: '#0A1F38',
  },
]

const SPIN_REWARD_BY_TYPE = Object.fromEntries(
  SPIN_REWARDS.map((reward) => [reward.type, reward]),
) as Record<SpinRewardType, SpinReward>

/** Picks the wheel outcome from cart value — random only within the eligible tier. */
export function pickSpinRewardForCartTotal(cartTotal: number): SpinReward {
  if (cartTotal >= 20_000) {
    return SPIN_REWARD_BY_TYPE.thirty_shot_plus_one_k
  }
  if (cartTotal >= 10_000) {
    return SPIN_REWARD_BY_TYPE.thirty_shot
  }
  if (cartTotal >= 5_000) {
    const pool = [SPIN_REWARD_BY_TYPE.one_k_wala, SPIN_REWARD_BY_TYPE.single_pipe]
    return pool[Math.floor(Math.random() * pool.length)]!
  }
  const pool = [SPIN_REWARD_BY_TYPE.tin_fountain, SPIN_REWARD_BY_TYPE.helicopter]
  return pool[Math.floor(Math.random() * pool.length)]!
}

export function getSpinLandingRotation(segmentIndex: number, extraSpins = 6): number {
  const segmentCenter = getSegmentCenterAngle(segmentIndex)
  return extraSpins * 360 + (360 - segmentCenter)
}

/** Clockwise rotation from current position to land segment under the top pointer. */
export function getNextSpinRotation(
  currentRotation: number,
  segmentIndex: number,
  extraSpins: number,
): number {
  const targetMod = normalizeWheelDegrees(getSpinLandingRotation(segmentIndex, 0))
  const currentMod = normalizeWheelDegrees(currentRotation)
  let delta = targetMod - currentMod
  if (delta <= 0) delta += 360
  return currentRotation + delta + extraSpins * 360
}

export function getSegmentArcAngles(segmentIndex: number): {
  start: number
  end: number
  center: number
} {
  const start = segmentIndex * SPIN_SEGMENT_DEGREES
  const end = start + SPIN_SEGMENT_DEGREES
  return { start, end, center: getSegmentCenterAngle(segmentIndex) }
}

/** Map clockwise degrees from 12 o'clock to SVG x/y. */
export function polarFromTop(cx: number, cy: number, radius: number, degreesFromTop: number) {
  const radians = ((degreesFromTop - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

export function describeWheelSegmentPath(
  cx: number,
  cy: number,
  outerRadius: number,
  segmentIndex: number,
): string {
  const { start, end } = getSegmentArcAngles(segmentIndex)
  const startPoint = polarFromTop(cx, cy, outerRadius, start)
  const endPoint = polarFromTop(cx, cy, outerRadius, end)
  const largeArc = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y} Z`
}

export function buildWheelGradient(): string {
  const stops = SPIN_REWARDS.map((segment) => {
    const start = segment.segmentIndex * SPIN_SEGMENT_DEGREES
    const end = start + SPIN_SEGMENT_DEGREES
    return `${segment.color} ${start}deg ${end}deg`
  })
  // 0deg = 12 o'clock in modern browsers — matches pointer and label layout.
  return `conic-gradient(${stops.join(', ')})`
}

/** Spin rewards are free gifts — no monetary discount on the cart. */
export function calculateSpinDiscount(_subtotal: number, _reward: SpinReward | null): number {
  return 0
}

export function rewardHasMonetaryDiscount(_type: SpinRewardType): boolean {
  return false
}

export function getSpinRewardMessage(reward: SpinReward): string {
  return `You won ${reward.label}! Mention this free gift when you send your WhatsApp enquiry.`
}
