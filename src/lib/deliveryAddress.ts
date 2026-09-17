export interface DeliveryAddressFields {
  doorNo: string
  street: string
  landmark?: string
  pincode?: string
  /** GPS-detected area / city with optional map link */
  locationSnapshot?: string
}

export function buildFullDeliveryAddress(fields: DeliveryAddressFields): string {
  const lines: string[] = []

  const doorStreet = [fields.doorNo.trim(), fields.street.trim()].filter(Boolean).join(', ')
  if (doorStreet) lines.push(doorStreet)

  if (fields.landmark?.trim()) {
    lines.push(`Landmark: ${fields.landmark.trim()}`)
  }

  if (fields.pincode?.trim()) {
    lines.push(`Pincode: ${fields.pincode.trim()}`)
  }

  if (fields.locationSnapshot?.trim()) {
    if (lines.length > 0) lines.push('')
    lines.push(fields.locationSnapshot.trim())
  }

  return lines.join('\n')
}

export function validateDeliveryAddress(fields: DeliveryAddressFields): string | null {
  if (!fields.doorNo.trim()) {
    return 'Please enter door / flat number'
  }

  if (!fields.street.trim()) {
    return 'Please enter street / building name'
  }

  return null
}

const emptyAddressFields = (): DeliveryAddressFields => ({
  doorNo: '',
  street: '',
  landmark: '',
  pincode: '',
  locationSnapshot: '',
})

export { emptyAddressFields }
