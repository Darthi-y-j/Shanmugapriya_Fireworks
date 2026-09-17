import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_SETTINGS, getWebsiteSettings } from '@/services/settings'
import type { WebsiteSettings } from '@/types/database'
import { logLandingPageApi, logLandingPageApiError } from '@/lib/landingPageApiLog'

interface SettingsContextType {
  settings: WebsiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    setLoading(true)
    logLandingPageApi('SettingsContext.loadSettings:start')
    try {
      const data = await getWebsiteSettings()
      setSettings(data)
      logLandingPageApi('SettingsContext.loadSettings:done', {
        businessName: data.business_name,
        fromDefault: data.id === 'default',
      })
    } catch (error) {
      setSettings(DEFAULT_SETTINGS)
      logLandingPageApiError('SettingsContext.loadSettings:failed', {
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  const value = useMemo(
    () => ({ settings, loading, refresh: loadSettings }),
    [settings, loading],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}
