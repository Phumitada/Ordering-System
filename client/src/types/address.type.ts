export interface Address {
  id: string
  userId: string
  label: string
  recipientName?: string | null
  phone?: string | null
  addressLine?: string | null
  lat?: number | null
  lng?: number | null
}

export interface AddressPayload {
  label?: string
  recipient_name?: string
  phone?: string
  address_line: string
  lat?: number
  lng?: number
}
