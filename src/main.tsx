import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { preloadRouteImages } from '@/lib/preloadSiteImages'

preloadRouteImages(window.location.pathname)

document.getElementById('static-seo-fallback')?.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
