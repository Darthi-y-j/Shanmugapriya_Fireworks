import { useSettings } from '@/contexts/SettingsContext'
import { cn } from '@/lib/utils'

export function FloatingActionButtons({
  embedded = false,
  className,
}: {
  embedded?: boolean
  className?: string
}) {
  const { settings } = useSettings()

  const instagramUrl = settings.social_links.instagram
  const facebookUrl = settings.social_links.facebook
  const youtubeUrl = settings.social_links.youtube

  if (!instagramUrl && !facebookUrl && !youtubeUrl) return null

  const buttons = (
    <>
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl animate-scale-in"
          aria-label="Instagram"
          title="Follow on Instagram"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      )}

      {facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl animate-scale-in [animation-delay:100ms]"
          aria-label="Facebook"
          title="Follow on Facebook"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      )}

      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl animate-scale-in [animation-delay:150ms]"
          aria-label="YouTube"
          title="Subscribe on YouTube"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      )}
    </>
  )

  if (embedded) return buttons

  return (
    <div
      className={cn(
        'fixed bottom-6 right-4 z-30 flex flex-col gap-3 sm:bottom-8 sm:right-6',
        className,
      )}
    >
      {buttons}
    </div>
  )
}
