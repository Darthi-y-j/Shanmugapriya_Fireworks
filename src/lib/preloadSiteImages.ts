import { HOME_IMAGES } from '@/lib/homeImages'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'

const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/account']
const AUTH_IMAGE_PATHS = [SHANMUGA_BRAND.loginBg, SHANMUGA_BRAND.loginCardBg]

const HOME_PRIORITY_PATHS = [HOME_IMAGES.heroBg, HOME_IMAGES.topBanner]

let bootPreloadStarted = false

function preloadPaths(paths: string[]): void {
  for (const path of paths) {
    preloadImage(assetWithWebp(path).webp)
  }
}

/** Run synchronously in main.tsx before React paints — uses current URL only. */
export function preloadRouteImages(pathname: string): void {
  if (pathname.startsWith('/admin/login')) {
    preloadPaths([SHANMUGA_BRAND.loginBg])
    return
  }

  if (AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    preloadPaths(AUTH_IMAGE_PATHS)
    return
  }

  if (pathname === '/' || pathname === '/home') {
    preloadPaths(HOME_PRIORITY_PATHS)
  }
}

/** Reserved for future idle preloads — keep homepage network quiet after LCP. */
export function preloadSiteImagesDeferred(_pathname: string): void {
  if (bootPreloadStarted || typeof document === 'undefined') return
  bootPreloadStarted = true
}
