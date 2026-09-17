export type GeolocationErrorCode = 'unsupported' | 'denied' | 'unavailable' | 'timeout' | 'lookup_failed'

export class GeolocationError extends Error {
  code: GeolocationErrorCode

  constructor(code: GeolocationErrorCode, message: string) {
    super(message)
    this.name = 'GeolocationError'
    this.code = code
  }
}

type ReverseGeocodeResponse = {
  locality?: string
  city?: string
  principalSubdivision?: string
  postcode?: string
  countryName?: string
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new GeolocationError('unsupported', 'Location is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        reject(new GeolocationError('denied', 'Location permission was denied. Allow location access or type your address.'))
        return
      }
      if (error.code === error.TIMEOUT) {
        reject(new GeolocationError('timeout', 'Could not detect location in time. Please try again.'))
        return
      }
      reject(new GeolocationError('unavailable', 'Could not detect your location. Please enter your address manually.'))
    }, {
      enableHighAccuracy: true,
      timeout: 15_000,
      maximumAge: 60_000,
    })
  })
}

function formatAddress(data: ReverseGeocodeResponse, latitude: number, longitude: number): string {
  const parts = [data.locality, data.city, data.principalSubdivision, data.postcode, data.countryName]
    .map((part) => part?.trim())
    .filter(Boolean)

  const unique = [...new Set(parts)]
  const base = unique.join(', ')
  const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`

  return base ? `${base}\n(Map: ${mapsLink})` : `Location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}\n(Map: ${mapsLink})`
}

/** Browser GPS + free reverse geocode — same pattern used by many delivery apps. */
export async function getCurrentDeliveryAddress(): Promise<string> {
  const position = await getCurrentPosition()
  const { latitude, longitude } = position.coords

  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('localityLanguage', 'en')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new GeolocationError('lookup_failed', 'Could not resolve your address. Please type it manually.')
  }

  const data = (await response.json()) as ReverseGeocodeResponse
  return formatAddress(data, latitude, longitude)
}

export function geolocationErrorMessage(error: unknown): string {
  if (error instanceof GeolocationError) return error.message
  return 'Could not get your location. Please enter your address manually.'
}
