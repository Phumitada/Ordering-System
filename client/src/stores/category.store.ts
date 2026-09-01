import { create } from 'zustand'
import toast from 'react-hot-toast'
import { categoryService } from '@/api/services/category.service'
import type { Category } from '@/types/category.type'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  isError: boolean
  errorMsg: string | null
  getCategories: () => Promise<void>
  addCategory: (name: string) => Promise<boolean>
  updateCategory: (id: string, name: string) => Promise<boolean>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  isError: false,
  errorMsg: null,

  getCategories: async () => {
    try {
      set({ isLoading: true, isError: false, errorMsg: null })
      const categories = await categoryService.list()
      set({ isLoading: false, categories })
    } catch (error: any) {
      set({ isLoading: false, isError: true, errorMsg: error.response?.data?.message || 'โหลดข้อมูลไม่สำเร็จ' })
    }
  },

  addCategory: async (name) => {
    try {
      set({ isLoading: true })
      await categoryService.create(name)
      await get().getCategories()
      toast.success('เพิ่มหมวดหมู่สำเร็จ')
      set({ isLoading: false })
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'เพิ่มไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  updateCategory: async (id, name) => {
    try {
      set({ isLoading: true })
      await categoryService.update(id, { name })
      await get().getCategories()
      toast.success('แก้ไขชื่อหมวดหมู่สำเร็จ')
      set({ isLoading: false })
      return true
    } catch {
      toast.error('แก้ไขไม่สำเร็จ')
      set({ isLoading: false })
      return false
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true })
      await categoryService.remove(id)
      await get().getCategories()
      toast.success('ลบหมวดหมู่สำเร็จ')
      set({ isLoading: false })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ลบไม่สำเร็จ (อาจมีสินค้าค้างอยู่)')
      set({ isLoading: false })
    }
  },
}))
