import { StaticPicture } from '@/components/shared/StaticPicture'
import { ABOUT_IMAGES } from '@/lib/aboutTokens'

type StoryArchFrameProps = {
  src?: string
  alt: string
}

export function StoryArchFrame({ src = ABOUT_IMAGES.storyCenter, alt }: StoryArchFrameProps) {
  return (
    <div className="about-story-frame relative mx-auto w-full max-w-[220px] sm:max-w-[340px] lg:max-w-[380px]">
      <div className="about-story-frame-inner overflow-hidden border-2 border-[#C9A24A]/80 shadow-[0_18px_50px_rgba(6,43,99,0.14)]">
        <StaticPicture
          src={src}
          alt={alt}
          imgClassName="aspect-[3/4] w-full object-cover object-center"
        />
      </div>
    </div>
  )
}
