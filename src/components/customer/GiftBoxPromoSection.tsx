import { Link } from 'react-router-dom'
import { Gift, ArrowRight } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

export function GiftBoxPromoSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-10 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_20%,rgba(245,158,11,0.18),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-gold-400/20 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-xl">
            <SectionHeader
              label="Gift Box"
              title="Make Your Own Gift Box"
              description="Choose crackers and fireworks yourself, pack them into a custom gift box, and send it with your enquiry."
              showAccent={false}
              theme="dark"
            />
          </div>
          <Link
            to="/gift-box"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-festive-500 to-gold-500 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-festive-500/25 transition hover:-translate-y-0.5"
          >
            <Gift className="h-4 w-4" />
            Build a Gift Box
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
