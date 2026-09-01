import { api } from '../client'
import type { Product, ProductFilters } from '@/types/product.type'

export interface ProductListResponse {
  products: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
}

export const productService = {
  list: (filters: Partial<ProductFilters> & { is_active?: string }): Promise<ProductListResponse> =>
    api.get('/product', { params: filters }).then((r) => r.data),

  getById: (id: string): Promise<Product> => api.get(`/product/${id}`).then((r) => r.data),

  create: (data: FormData) =>
    api.post('/product', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  update: (id: string, data: FormData) =>
    api.patch(`/product/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  updateStatus: (id: string, isActive: boolean) =>
    api.patch(`/product/${id}/status`, { is_active: isActive }).then((r) => r.data),

  remove: (id: string) => api.delete(`/product/${id}`).then((r) => r.data),
}
