export interface ShopSettings {
  id: string
  shopName: string
  phoneNumber: string
  email: string
  address: string
  openTime: string
  closeTime: string
  facebookUrl: string
  lineId: string
  description: string
  updatedAt: string
}

export interface UpdateSettingsPayload {
  shopName?: string
  phoneNumber?: string
  email?: string
  address?: string
  openTime?: string
  closeTime?: string
  facebookUrl?: string
  lineId?: string
  description?: string
}
