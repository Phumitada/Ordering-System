import { api } from '../client'
import type { Order, OrderFilters } from '@/types/order.type'

export interface AdminOrderListResponse {
  Orders: Order[]
  totalOrders: number
  totalPages: number
  currentPage: number
}

export interface CreateOrderRequest {
  items: { product_id: string; quantity: number; custom_note?: string }[]
  pickup_date: string
  fulfillment_type: 'PICKUP' | 'DELIVERY'
  delivery_info?: { recipient_name?: string; phone?: string; address?: string; rider_note?: string }
  shop_note?: string
}

export interface MyOrderListResponse {
  Orders: Order[]
  totalOrders: number
  totalPages: number
  currentPage: number
}

export const orderService = {
  create: (payload: CreateOrderRequest): Promise<{ message: string; order: Order }> => api.post('/order', payload).then((r) => r.data),

  confirmPayment: (id: string, formData: FormData) =>
    api.put(`/order/${id}/pay`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),

  // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ลูกค้าเดิมไม่มีหน้าประวัติการสั่งซื้อเลย
  myOrders: (params: { page?: number; limit?: number } = {}): Promise<MyOrderListResponse> =>
    api.get('/order/my', { params }).then((r) => r.data),

  getById: (id: string): Promise<Order> => api.get(`/order/${id}`).then((r) => r.data),

  adminList: (filters: Partial<OrderFilters>): Promise<AdminOrderListResponse> =>
    api.get('/order/admin/list', { params: filters }).then((r) => r.data),

  approve: (id: string) => api.put(`/order/admin/${id}/approve`).then((r) => r.data),

  reject: (id: string, reason?: string) => api.put(`/order/admin/${id}/reject`, { reason }).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.put(`/order/admin/${id}/status`, { status }).then((r) => r.data),
}
