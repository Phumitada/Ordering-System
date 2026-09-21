import { create } from 'zustand'
import toast from 'react-hot-toast'
import { settingsService } from '@/api/services/settings.service'
import type { ShopSettings, UpdateSettingsPayload } from '@/types/settings.type'

interface SettingsState {
  settings: ShopSettings | null
  isLoading: boolean
  getSettings: () => Promise<void>
  updateSettings: (payload: UpdateSettingsPayload) => Promise<boolean>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  getSettings: async () => {
    try {
      set({ isLoading: true })
      const settings = await settingsService.get()
      set({ settings, isLoading: false })
    } catch (error) {
      console.error(error)
      set({ isLoading: false })
    }
  },

  updateSettings: async (payload) => {
    try {
      set({ isLoading: true })
      await settingsService.update(payload)
      await get().getSettings()
      toast.success('บันทึกการตั้งค่าสำเร็จ')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'บันทึกไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },
}))
