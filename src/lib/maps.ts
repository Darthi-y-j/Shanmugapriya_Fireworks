/** Shanmugapriya Pyrotech — Google Maps share link. */
export const STORE_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/2HsFncwsQqWZu71N7'

/** Embedded map (coordinates from the share link above). */
export const STORE_MAP_EMBED_URL =
  'https://maps.google.com/maps?q=9.4997253,77.9359665&hl=en&z=17&output=embed'

/** @deprecated Use STORE_GOOGLE_MAPS_URL */
export const PRIME_CRACKERS_GOOGLE_MAPS_URL = STORE_GOOGLE_MAPS_URL

/** @deprecated Use STORE_MAP_EMBED_URL */
export const PRIME_CRACKERS_MAP_EMBED_URL = STORE_MAP_EMBED_URL

export function hasStoreMap(): boolean {
  return Boolean(STORE_MAP_EMBED_URL.trim())
}
