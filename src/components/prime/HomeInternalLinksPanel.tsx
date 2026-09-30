import { HOME_SEO_NAV_LINKS } from '@/lib/seoInternalLinks'

type HomeInternalLinksPanelProps = {
  title: string
  id: string
}

/**
 * Crawlable internal links — plain anchors, no lazy routes, no animation.
 */
export function HomeInternalLinksPanel({ title, id }: HomeInternalLinksPanelProps) {
  return (
    <nav
      className="border-t border-[#E8DFD0]/70 bg-[#FFFCF7] px-4 py-4 sm:px-6"
      aria-labelledby={id}
    >
      <h2 id={id} className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[#8B7355]">
        {title}
      </h2>
      <ul className="mx-auto mt-3 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
        {HOME_SEO_NAV_LINKS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block text-center text-xs font-medium text-[#062B63] underline-offset-2 hover:text-[#0077B6] hover:underline sm:text-sm"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
