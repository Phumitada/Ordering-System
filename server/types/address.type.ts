export interface CreateAddressPayload {
  label?: string
  recipient_name?: string
  phone?: string
  address_line: string
  lat?: number
  lng?: number
}

export interface UpdateAddressPayload {
  label?: string
  recipient_name?: string
  phone?: string
  address_line?: string
  lat?: number
  lng?: number
}
