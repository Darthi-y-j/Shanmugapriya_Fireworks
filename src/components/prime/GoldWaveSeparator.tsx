const GOLD = '#C4A962'

/** Subtle wavy gold double-line divider with crossing wave pairs */
export function GoldWaveSeparator() {
  return (
    <div
      className="relative z-20 w-full overflow-hidden bg-white py-2 sm:py-3"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-8 w-full max-w-none opacity-60 sm:h-10"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gold-wave-stroke" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0" />
            <stop offset="12%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="50%" stopColor={GOLD} stopOpacity="0.7" />
            <stop offset="88%" stopColor={GOLD} stopOpacity="0.45" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Upper double wave */}
        <path
          d="M-20,24 C180,6 360,42 540,24 S900,6 1080,24 S1260,42 1460,24"
          stroke="url(#gold-wave-stroke)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <path
          d="M-20,27 C180,9 360,45 540,27 S900,9 1080,27 S1260,45 1460,27"
          stroke="url(#gold-wave-stroke)"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Lower double wave — opposite phase, criss-crosses upper pair */}
        <path
          d="M-20,32 C180,50 360,14 540,32 S900,50 1080,32 S1260,14 1460,32"
          stroke="url(#gold-wave-stroke)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <path
          d="M-20,35 C180,53 360,17 540,35 S900,53 1080,35 S1260,17 1460,35"
          stroke="url(#gold-wave-stroke)"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </div>
  )
}
