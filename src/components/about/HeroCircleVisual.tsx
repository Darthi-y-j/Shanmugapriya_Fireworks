import { ABOUT_IMAGES } from '@/lib/aboutTokens'

export function HeroCircleVisual() {
  return (
    <div className="relative mx-auto h-[min(92vw,400px)] w-[min(92vw,400px)] sm:h-[440px] sm:w-[440px] lg:h-[480px] lg:w-[480px] xl:h-[520px] xl:w-[520px]">
      <img
        src={`${ABOUT_IMAGES.rangoliBg}?v=2`}
        alt=""
        className="pointer-events-none absolute -right-8 -top-4 h-52 w-52 opacity-[0.28] sm:h-60 sm:w-60 lg:-right-4 lg:h-72 lg:w-72"
        aria-hidden="true"
        loading="lazy"
      />

      <div
        className="pointer-events-none absolute inset-[4%] rounded-full border border-dashed border-[#C9A24A]/40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[7%] rounded-full border border-dashed border-[#C9A24A]/25"
        aria-hidden="true"
      />

      {/* Circle — temple only */}
      <div className="absolute inset-[10%] overflow-hidden rounded-full shadow-[0_28px_70px_rgba(6,43,99,0.22)] ring-2 ring-[#C9A24A]/75 sm:ring-[3px]">
        <img
          src={ABOUT_IMAGES.heroTemple}
          alt=""
          className="h-full w-full scale-105 object-cover object-[center_18%]"
          loading="eager"
          fetchPriority="high"
          aria-hidden="true"
        />
      </div>

      {/* Boy cutout — overlaps circle from the front, not clipped inside it */}
      <img
        src={ABOUT_IMAGES.heroBoy}
        alt="Child celebrating with sparklers"
        className="pointer-events-none absolute -bottom-[16%] left-1/2 z-20 h-[90%] w-auto max-w-[115%] -translate-x-1/2 object-contain object-bottom sm:-bottom-[18%] sm:h-[94%] lg:-bottom-[20%] lg:max-w-[110%]"
        loading="eager"
      />
    </div>
  )
}
