import { HOME_SEO_NAV_LINKS } from '@/lib/seoInternalLinks'

/**
 * Plain anchor links (no animation) so SEO tools count internal links on first paint.
 */
export function HomeInternalLinksBar() {
  return (
    <nav
      className="border-b border-[#E8DFD0]/70 bg-[#FFFCF7]/95 px-4 py-3 sm:px-6"
      aria-label="Site pages"
    >
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs sm:text-sm">
        {HOME_SEO_NAV_LINKS.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <a
              href={item.href}
              className="font-medium text-[#062B63]/85 underline-offset-2 transition hover:text-[#0077B6] hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
