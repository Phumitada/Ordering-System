import { api } from '../client'
import type { Address, AddressPayload } from '@/types/address.type'

export const addressService = {
  list: (): Promise<Address[]> => api.get('/addresses').then((r) => r.data),
  create: (payload: AddressPayload) => api.post('/addresses', payload).then((r) => r.data),
  update: (id: string, payload: Partial<AddressPayload>) => api.patch(`/addresses/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/addresses/${id}`).then((r) => r.data),
}
