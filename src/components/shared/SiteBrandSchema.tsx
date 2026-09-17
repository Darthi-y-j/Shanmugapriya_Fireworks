import { JsonLd } from '@/components/shared/JsonLd'
import { useSettings } from '@/contexts/SettingsContext'
import { buildHomePageSchema } from '@/lib/structuredData'

/** Organization + WebSite JSON-LD on every public page (Google logo & site name). */
export function SiteBrandSchema() {
  const { settings } = useSettings()

  return <JsonLd data={buildHomePageSchema(settings)} />
}
