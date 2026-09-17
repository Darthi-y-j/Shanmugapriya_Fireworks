import type { LucideIcon } from 'lucide-react'

type ValueItemProps = {
  icon: LucideIcon
  title: string
  description: string
}

export function ValueItem({ icon: Icon, title, description }: ValueItemProps) {
  return (
    <article className="flex flex-col items-center px-6 py-10 text-center sm:px-8 sm:py-12">
      <div
        className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-[#062B63]/20 bg-white/40"
        aria-hidden="true"
      >
        <Icon className="h-6 w-6 text-[#062B63]" strokeWidth={1.25} />
      </div>
      <h3 className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#062B63]">
        {title}
      </h3>
      <p className="mt-2 max-w-[12rem] text-sm leading-relaxed text-[#062B63]/72">{description}</p>
    </article>
  )
}
