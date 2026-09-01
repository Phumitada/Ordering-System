import { create } from 'zustand'
import { productService } from '@/api/services/product.service'
import type { Product, ProductFilters } from '@/types/product.type'

interface ProductAdminState {
  isLoading: boolean
  isError: boolean
  errorMsg: string
  categoryProducts: Product[]
  isCategoryLoading: boolean
  products: Product[]
  totalPages: number
  currentPage: number
  totalProducts: number
  filters: ProductFilters
  setFilter: (newFilters: Partial<ProductFilters>) => void
  fetchProductsByCategory: (categoryId: string) => Promise<void>
  fetchProducts: () => Promise<void>
  AddProduct: (data: FormData) => Promise<{ success: boolean; message?: string }>
  toggleProductStatus: (id: string, currentStatus: boolean) => Promise<boolean>
  editProduct: (id: string, data: FormData) => Promise<{ success: boolean; message?: string }>
  deleteProduct: (id: string) => Promise<boolean>
  moveProductCategory: (productId: string, newCategoryId: string) => Promise<{ success: boolean; message?: string }>
}

export const productAdminStore = create<ProductAdminState>((set, get) => ({
  isLoading: false,
  isError: false,
  errorMsg: '',
  categoryProducts: [],
  isCategoryLoading: false,
  products: [],
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  filters: { page: 1, limit: 10, search: '', category: '', sort: 'createdAt', order: 'desc' },

  setFilter: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }))
    get().fetchProducts()
  },

  fetchProductsByCategory: async (categoryId) => {
    try {
      set({ isCategoryLoading: true })
      const res = await productService.list({ category: categoryId, limit: 100 } as any)
      set({ categoryProducts: res.products, isCategoryLoading: false })
    } catch (error) {
      console.error(error)
      set({ isCategoryLoading: false })
    }
  },

  fetchProducts: async () => {
    try {
      set({ isLoading: true, isError: false, errorMsg: '' })
      const { filters } = get()
      const res = await productService.list(filters as any)
      set({
        products: res.products || [],
        totalPages: res.totalPages || 1,
        currentPage: res.currentPage || 1,
        totalProducts: res.totalProducts || 0,
        isLoading: false,
      })
    } catch (error: any) {
      set({ isLoading: false, isError: true, errorMsg: error.message })
    }
  },

  AddProduct: async (data) => {
    try {
      set({ isLoading: true })
      const result = await productService.create(data)
      await get().fetchProducts()
      set({ isLoading: false })
      return { success: true, message: result.message }
    } catch (error: any) {
      set({ isLoading: false })
      return { success: false, message: error.response?.data?.message || 'เพิ่มสินค้าไม่สำเร็จ' }
    }
  },

  toggleProductStatus: async (id, currentStatus) => {
    try {
      await productService.updateStatus(id, !currentStatus)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p)),
      }))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },

  editProduct: async (id, data) => {
    try {
      set({ isLoading: true })
      const res = await productService.update(id, data)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? res.product : p)),
        isLoading: false,
      }))
      return { success: true }
    } catch (error: any) {
      set({ isLoading: false })
      return { success: false, message: error.response?.data?.message || 'แก้ไขไม่สำเร็จ' }
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true })
      await productService.remove(id)
      await get().fetchProducts()
      set({ isLoading: false })
      return true
    } catch (error) {
      set({ isLoading: false })
      return false
    }
  },

  moveProductCategory: async (productId, newCategoryId) => {
    try {
      const data = new FormData()
      data.append('category', newCategoryId)
      const result = await get().editProduct(productId, data)
      if (result.success) {
        set((state) => ({ categoryProducts: state.categoryProducts.filter((p) => p.id !== productId) }))
      }
      return result
    } catch {
      return { success: false, message: 'ย้ายหมวดหมู่ไม่สำเร็จ' }
    }
  },
}))
