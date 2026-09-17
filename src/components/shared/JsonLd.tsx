import { Helmet } from 'react-helmet-async'

interface JsonLdProps {
  data: Record<string, unknown>
}

/** Injects JSON-LD structured data for search engines (no visible UI). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
