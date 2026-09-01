import { create } from 'zustand'
import { inventoryService } from '@/api/services/inventory.service'
import type { InventoryItem } from '@/types/inventory.type'

const getCurrentDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })

interface InventoryState {
  inventories: InventoryItem[]
  isLoading: boolean
  isError: boolean
  errorMsg: string | null
  dateStr: string
  setDate: (newDate: string) => void
  getInventories: () => Promise<void>
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventories: [],
  isLoading: false,
  isError: false,
  errorMsg: null,
  dateStr: getCurrentDate(),

  setDate: (newDate) => {
    set({ dateStr: newDate })
    get().getInventories()
  },

  getInventories: async () => {
    try {
      set({ isLoading: true, isError: false, errorMsg: null })
      const inventories = await inventoryService.getByDate(get().dateStr)
      set({ isLoading: false, inventories })
    } catch (error: any) {
      set({ isLoading: false, isError: true, errorMsg: error.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ' })
    }
  },
}))
