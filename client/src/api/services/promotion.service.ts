import { api } from '../client'
import type { Promotion } from '@/types/promotion.type'

export const promotionService = {
  list: (): Promise<Promotion[]> => api.get('/promotions').then((r) => r.data),
  adminList: (): Promise<Promotion[]> => api.get('/promotions/admin/list').then((r) => r.data),
  create: (data: FormData) =>
    api.post('/promotions', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData) =>
    api.patch(`/promotions/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id: string) => api.delete(`/promotions/${id}`).then((r) => r.data),
}
