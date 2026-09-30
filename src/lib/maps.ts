/** Store listing — https://maps.app.goo.gl/Yweo1kEmEFhpnE4F7 */
export const STORE_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/Yweo1kEmEFhpnE4F7'

/**
 * Google Business CID for Place Details (reviews). Hex 0x68f27e70b2eb5d54 from the share link.
 * Override with GOOGLE_PLACE_CID on the server if the listing changes.
 */
export const STORE_GOOGLE_PLACE_CID = '7562245746811690324'

/** Place ID for Google Maps JavaScript Places API (same listing as share link). */
export const STORE_GOOGLE_PLACE_ID = 'Cg0q3bA1O1uHNAqjO2gYEA'

/** Embedded map (Pattampudur listing from the share link above). */
export const STORE_MAP_EMBED_URL =
  'https://maps.google.com/maps?q=FWXP%2BVFJ+Sivakasi+crackers+shop,+Pattampudur,+Tamil+Nadu+626003&hl=en&z=17&output=embed'

/** @deprecated Use STORE_GOOGLE_MAPS_URL */
export const PRIME_CRACKERS_GOOGLE_MAPS_URL = STORE_GOOGLE_MAPS_URL

/** @deprecated Use STORE_MAP_EMBED_URL */
export const PRIME_CRACKERS_MAP_EMBED_URL = STORE_MAP_EMBED_URL

export function hasStoreMap(): boolean {
  return Boolean(STORE_MAP_EMBED_URL.trim())
}
