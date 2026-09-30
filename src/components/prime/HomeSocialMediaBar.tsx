import { HomeCelebrationSocial } from '@/components/prime/HomeCelebrationSocial'

/** Standalone social strip (home page uses Join Our Celebration card instead). */
export function HomeSocialMediaBar() {
  return (
    <section
      className="border-t-2 border-[#C9A24A]/50 bg-gradient-to-b from-[#FFFCF7] to-[#F0E8DA] px-4 py-8 sm:px-6 sm:py-10"
      aria-label="Social media"
    >
      <div className="mx-auto max-w-7xl rounded-2xl border border-[#E8DFD0]/90 bg-white/80 px-4 py-6 shadow-[0_12px_40px_rgba(6,43,99,0.08)] backdrop-blur-sm sm:px-8 sm:py-8">
        <HomeCelebrationSocial theme="light" />
      </div>
    </section>
  )
}
