import { api } from '../client'
import type { ShopSettings, UpdateSettingsPayload } from '@/types/settings.type'

export const settingsService = {
  get: (): Promise<ShopSettings> => api.get('/settings').then((r) => r.data),
  update: (payload: UpdateSettingsPayload) => api.patch('/settings', payload).then((r) => r.data),
}
