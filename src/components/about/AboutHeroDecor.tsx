/** Gold hanging lantern line-art — top center accent */
export function AboutHeroHangDecor() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[4.75rem] z-[2] hidden -translate-x-1/2 sm:block lg:top-[5.25rem]"
      aria-hidden="true"
    >
      <svg
        width="140"
        height="72"
        viewBox="0 0 140 72"
        fill="none"
        className="text-[#C9A24A]/55"
      >
        <path d="M70 4v14" stroke="currentColor" strokeWidth="0.75" />
        <path d="M58 18h24" stroke="currentColor" strokeWidth="0.75" />
        <path d="M62 18v6" stroke="currentColor" strokeWidth="0.6" />
        <path d="M78 18v6" stroke="currentColor" strokeWidth="0.6" />
        <path
          d="M58 24c0 8 5 12 12 12s12-4 12-12"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path d="M48 10l4 8M92 10l-4 8" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="48" cy="10" r="1.5" fill="currentColor" />
        <circle cx="92" cy="10" r="1.5" fill="currentColor" />
        <path d="M34 28l3 5M106 28l-3 5" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
      </svg>
    </div>
  )
}

export function AboutHeroBirds() {
  return (
    <>
      <svg
        className="pointer-events-none absolute left-[38%] top-[34%] z-[1] hidden h-6 w-20 text-[#062B63]/30 sm:block lg:left-[40%] lg:top-[32%]"
        viewBox="0 0 80 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 12c5-6 12-8 18-4 3 2 6 2 9 0 6-4 12-3 17 4-5-1-10-1-15 1-3 1-6 1-9 0-5-1-10-1-15-1z" />
      </svg>
      <svg
        className="pointer-events-none absolute left-[44%] top-[38%] z-[1] hidden h-5 w-16 text-[#062B63]/22 sm:block lg:left-[46%]"
        viewBox="0 0 64 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M2 10c4-5 10-6 15-3 5-3 11-2 15 3-4-1-8-1-12 0-3 1-6 0-9 0-4-1-8-1-12 0z" />
      </svg>
    </>
  )
}

export function AboutHeroForegroundDiya() {
  return (
    <div
      className="pointer-events-none absolute bottom-4 right-4 z-[3] h-24 w-24 opacity-40 sm:bottom-6 sm:right-6"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-[#E8C56A]/20 blur-2xl" />
    </div>
  )
}
