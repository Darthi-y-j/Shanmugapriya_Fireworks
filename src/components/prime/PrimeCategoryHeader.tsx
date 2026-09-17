export function PrimeCategoryHeader({ name }: { name: string }) {
  return (
    <div
      className="relative overflow-hidden border-b border-[#C9A24A]/60 bg-[#0F2847] px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-white sm:text-base"
    >
      <span
        className="absolute inset-y-0 left-0 w-1.5 bg-[#E8C56A]"
        aria-hidden="true"
      />
      <span className="relative">{name}</span>
    </div>
  )
}
