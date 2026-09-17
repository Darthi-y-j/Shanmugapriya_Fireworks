import type { ComponentType } from 'react'

type IconProps = { className?: string }

export function SparklersIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect width="96" height="96" fill="transparent" />
      <path d="M28 72 L32 28 L36 72" stroke="#8B5E34" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 72 L48 24 L52 72" stroke="#C9A24A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 72 L64 30 L68 72" stroke="#8B5E34" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="24" r="4" fill="#FFD700" />
      <circle cx="48" cy="18" r="5" fill="#FF8C42" />
      <circle cx="64" cy="22" r="4" fill="#FFD700" />
      <path d="M20 20 L24 16 M76 18 L80 22 M18 40 L22 44" stroke="#FFD700" strokeWidth="1.5" />
    </svg>
  )
}

export function FlowerPotsIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M30 68 L36 38 L42 68 Z" fill="#E85D04" />
      <path d="M42 68 L48 34 L54 68 Z" fill="#F48C06" />
      <path d="M54 68 L60 40 L66 68 Z" fill="#DC2F02" />
      <ellipse cx="36" cy="38" rx="8" ry="3" fill="#FFD166" />
      <ellipse cx="48" cy="34" rx="9" ry="3" fill="#FFD166" />
      <ellipse cx="60" cy="40" rx="8" ry="3" fill="#FFD166" />
      <path d="M28 68 H68" stroke="#8B5E34" strokeWidth="2" />
    </svg>
  )
}

export function ChakkarsIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="48" r="22" fill="none" stroke="#0969D5" strokeWidth="5" />
      <circle cx="48" cy="48" r="14" fill="none" stroke="#C9A24A" strokeWidth="3" />
      <circle cx="48" cy="48" r="4" fill="#062B63" />
      <path d="M48 26 L48 18 M48 78 L48 70 M26 48 L18 48 M78 48 L70 48" stroke="#FFD700" strokeWidth="2" />
    </svg>
  )
}

export function RocketsIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M30 72 L34 36 L38 72 Z" fill="#E63946" />
      <path d="M44 72 L48 28 L52 72 Z" fill="#457B9D" />
      <path d="M58 72 L62 34 L66 72 Z" fill="#F4A261" />
      <path d="M34 36 L38 24 L34 28 Z" fill="#FFD166" />
      <path d="M48 28 L52 14 L48 18 Z" fill="#FFD166" />
      <path d="M62 34 L66 22 L62 26 Z" fill="#FFD166" />
      <circle cx="38" cy="20" r="2" fill="#FFD700" opacity="0.8" />
      <circle cx="52" cy="12" r="2.5" fill="#FFD700" opacity="0.8" />
    </svg>
  )
}

export function AerialShotsIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="44" r="6" fill="#FFD700" />
      <path d="M48 44 L48 16 M48 44 L72 30 M48 44 L24 30 M48 44 L64 68 M48 44 L32 68 M48 44 L16 48 M48 44 L80 48" stroke="#E63946" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 44 L60 20 M48 44 L36 20 M48 44 L70 56 M48 44 L26 56" stroke="#457B9D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="30" r="2" fill="#F4A261" />
      <circle cx="72" cy="30" r="2" fill="#2A9D8F" />
      <circle cx="64" cy="68" r="2" fill="#E63946" />
    </svg>
  )
}

export function CrackersIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect x="22" y="34" width="52" height="14" rx="3" fill="#C1121F" />
      <rect x="22" y="50" width="52" height="14" rx="3" fill="#E5383B" />
      <rect x="22" y="66" width="52" height="14" rx="3" fill="#C1121F" />
      <path d="M22 41 H74 M22 57 H74 M22 73 H74" stroke="#FFD166" strokeWidth="1" opacity="0.6" />
      <path d="M18 34 C14 38 14 44 18 48" stroke="#8B5E34" strokeWidth="2" fill="none" />
    </svg>
  )
}

export function GiftBoxesIcon({ className = 'h-full w-full' }: IconProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <rect x="20" y="42" width="28" height="24" rx="2" fill="#457B9D" />
      <rect x="48" y="36" width="28" height="30" rx="2" fill="#E63946" />
      <rect x="20" y="42" width="28" height="6" fill="#FFD166" />
      <rect x="48" y="36" width="28" height="6" fill="#FFD166" />
      <path d="M34 42 V66 M62 36 V66" stroke="#FFD166" strokeWidth="2" />
      <path d="M34 30 C34 38 28 42 20 42 C28 42 34 46 34 54 C34 46 40 42 48 42 C40 42 34 38 34 30 Z" fill="#C9A24A" />
      <path d="M62 24 C62 32 56 36 48 36 C56 36 62 40 62 48 C62 40 68 36 76 36 C68 36 62 32 62 24 Z" fill="#C9A24A" />
    </svg>
  )
}

export const HOME_CATEGORY_ICONS: Record<string, ComponentType<IconProps>> = {
  sparklers: SparklersIcon,
  'flower-pots': FlowerPotsIcon,
  chakkars: ChakkarsIcon,
  rockets: RocketsIcon,
  'aerial-shots': AerialShotsIcon,
  crackers: CrackersIcon,
  'gift-boxes': GiftBoxesIcon,
}
