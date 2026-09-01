import { api } from '../client'
import type { AdminUser } from '@/types/user.type'

export const userService = {
  list: (): Promise<AdminUser[]> => api.get('/users').then((r) => r.data),
  updateRole: (id: string, role: 'USER' | 'ADMIN') =>
    api.patch(`/users/${id}/role`, { role }).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
}
