import { api, axiosPublic } from '../client'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.type'

export const authService = {
  register: (payload: RegisterPayload) =>
    axiosPublic.post('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload): Promise<{ user: User; accessToken: string }> =>
    axiosPublic.post('/auth/login', payload).then((r) => r.data.data),

  logout: () => api.post('/auth/logout'),

  getMe: (): Promise<User> => api.get('/auth/me').then((r) => r.data.data),
}
