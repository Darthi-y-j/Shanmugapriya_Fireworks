import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { preloadRouteImages } from '@/lib/preloadSiteImages'
import { preconnectSupabase } from '@/lib/supabasePreconnect'

preconnectSupabase()
preloadRouteImages(window.location.pathname)

const staticSeoFallback = document.getElementById('static-seo-fallback')
if (staticSeoFallback) staticSeoFallback.hidden = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
