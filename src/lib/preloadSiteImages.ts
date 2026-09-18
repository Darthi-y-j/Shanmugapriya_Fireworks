import { ABOUT_IMAGES } from '@/lib/aboutTokens'
import { HOME_IMAGES } from '@/lib/homeImages'
import { SHANMUGA_BRAND } from '@/lib/shanmugaBrand'
import { assetWithWebp } from '@/lib/optimizedAssets'

const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/account']
const AUTH_IMAGE_PATHS = [SHANMUGA_BRAND.loginBg, SHANMUGA_BRAND.loginCardBg]

/** Homepage images to warm-cache before React paints backgrounds. */
const HOME_EAGER_PATHS = [
  HOME_IMAGES.heroBg,
  HOME_IMAGES.topBanner,
  `${ABOUT_IMAGES.rangoliBg}?v=2`,
  HOME_IMAGES.aboutMobileBg,
  ABOUT_IMAGES.heritageTempleParallax,
]

function warmImage(url: string): void {
  const img = new Image()
  img.decoding = 'async'
  img.src = url
}

function warmPaths(paths: string[]): void {
  for (const path of paths) {
    warmImage(assetWithWebp(path).webp)
  }
}

/** Run synchronously in main.tsx before React paints. */
export function preloadRouteImages(pathname: string): void {
  if (pathname.startsWith('/admin/login')) {
    warmPaths([SHANMUGA_BRAND.loginBg])
    return
  }

  if (AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    warmPaths(AUTH_IMAGE_PATHS)
    return
  }

  if (pathname === '/' || pathname === '/home') {
    warmPaths(HOME_EAGER_PATHS)
  }
}

/** @deprecated Homepage preloads run eagerly in preloadRouteImages. */
export function preloadSiteImagesDeferred(_pathname: string): void {
  /* no-op */
}
