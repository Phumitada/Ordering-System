import { create } from 'zustand'
import toast from 'react-hot-toast'
import { promotionService } from '@/api/services/promotion.service'
import type { Promotion } from '@/types/promotion.type'

interface PromotionState {
  promotions: Promotion[]
  isLoading: boolean
  isError: boolean
  getPromotions: () => Promise<void>
  getAdminPromotions: () => Promise<void>
  addPromotion: (data: FormData) => Promise<boolean>
  editPromotion: (id: string, data: FormData) => Promise<boolean>
  deletePromotion: (id: string) => Promise<void>
}

export const usePromotionStore = create<PromotionState>((set, get) => ({
  promotions: [],
  isLoading: false,
  isError: false,

  getPromotions: async () => {
    try {
      set({ isLoading: true, isError: false })
      const promotions = await promotionService.list()
      set({ promotions, isLoading: false })
    } catch {
      set({ isLoading: false, isError: true })
    }
  },

  getAdminPromotions: async () => {
    try {
      set({ isLoading: true, isError: false })
      const promotions = await promotionService.adminList()
      set({ promotions, isLoading: false })
    } catch {
      set({ isLoading: false, isError: true })
    }
  },

  addPromotion: async (data) => {
    try {
      set({ isLoading: true })
      await promotionService.create(data)
      await get().getAdminPromotions()
      toast.success('เพิ่มโปรโมชั่นสำเร็จ')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'เพิ่มไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  editPromotion: async (id, data) => {
    try {
      set({ isLoading: true })
      await promotionService.update(id, data)
      await get().getAdminPromotions()
      toast.success('แก้ไขโปรโมชั่นสำเร็จ')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'แก้ไขไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  deletePromotion: async (id) => {
    try {
      await promotionService.remove(id)
      set((state) => ({ promotions: state.promotions.filter((p) => p.id !== id) }))
      toast.success('ลบโปรโมชั่นแล้ว')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ลบไม่สำเร็จ')
    }
  },
}))
