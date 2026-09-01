import { api } from '../client'
import type { Category } from '@/types/category.type'

export const categoryService = {
  list: (): Promise<Category[]> => api.get('/category').then((r) => r.data),
  create: (name: string) => api.post('/category', { name }).then((r) => r.data),
  update: (id: string, payload: { name?: string; isActive?: boolean }) =>
    api.patch(`/category/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/category/${id}`).then((r) => r.data),
}
