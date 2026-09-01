import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { io, Socket } from 'socket.io-client'
import { orderService } from '@/api/services/order.service'
import type { Order, OrderFilters } from '@/types/order.type'

interface DashboardFilters {
  page: number
  limit: number
  search: string
  status: string
  sortOrder: 'newest' | 'oldest'
}

interface OrderState {
  orders: Order[]
  isLoading: boolean
  socket: Socket | null
  currentPage: string | null
  abortController: AbortController | null
  filters: OrderFilters
  dashboard_filters: DashboardFilters

  initializeSocket: (pageName: string) => void
  disconnectSocket: () => void
  setFilter: (newFilters: Partial<OrderFilters>) => void
  setDashboardFilter: (newFilters: Partial<DashboardFilters>) => void
  fetchOrders: () => Promise<void>
  approveOrder: (id: string) => Promise<{ success: boolean }>
  rejectOrder: (id: string, reason?: string) => Promise<{ success: boolean }>
  updateOrderStatus: (id: string, newStatus: string) => Promise<void>
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      socket: null,
      currentPage: null,
      abortController: null,
      filters: { page: 1, limit: 10, search: '', status: 'WAITING_FOR_VERIFICATION', sortOrder: 'oldest' },
      dashboard_filters: { page: 1, limit: 5, search: '', status: 'COMPLETED', sortOrder: 'oldest' },

      // เดิม: initializeSocket() ใน useOrderStore.js — logic การจัดการ socket connection/room เหมือนเดิมทุกจุด
      initializeSocket: (pageName) => {
        const currentSocket = get().socket
        const previousPage = get().currentPage
        const prevAbortController = get().abortController
        if (prevAbortController) prevAbortController.abort()

        if (previousPage !== pageName) {
          set({ orders: [], currentPage: pageName })
        } else {
          set({ currentPage: pageName })
        }

        if (currentSocket && currentSocket.connected) return

        if (currentSocket) {
          currentSocket.removeAllListeners()
          currentSocket.disconnect()
        }

        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '')
        if (!apiUrl) return

        const socket = io(apiUrl, {
          query: { role: 'admin' },
          transports: ['websocket'],
          reconnectionAttempts: 5,
        })

        socket.on('connect', () => console.log('✅ Socket Connected:', socket.id))
        socket.on('connect_error', (err) => console.error('❌ Socket Error:', err))

        socket.on('newOrder', (order: Order) => {
          const { currentPage, orders } = get()
          if (currentPage !== 'approve') return
          if (order.status !== 'WAITING_FOR_VERIFICATION') return
          if (orders.some((o) => o.id === order.id)) return
          set((state) => ({ orders: [order, ...state.orders] }))
        })

        socket.on('paymentUploaded', (order: Order) => {
          const { currentPage, orders } = get()
          if (currentPage !== 'approve') return
          if (order.status !== 'WAITING_FOR_VERIFICATION') return
          const exists = orders.find((o) => o.id === order.id)
          if (exists) {
            set((state) => ({ orders: state.orders.map((o) => (o.id === order.id ? order : o)) }))
          } else {
            set((state) => ({ orders: [order, ...state.orders] }))
          }
        })

        socket.on('orderUpdated', (updatedOrder: Order) => {
          const { orders, currentPage } = get()
          const exists = orders.find((o) => o.id === updatedOrder.id)
          if (!exists) return

          if (currentPage === 'approve') {
            if (updatedOrder.status !== 'WAITING_FOR_VERIFICATION') {
              set({ orders: orders.filter((o) => o.id !== updatedOrder.id) })
            } else {
              set({ orders: orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)) })
            }
          } else if (currentPage === 'active') {
            const validStatuses = ['DELIVERING', 'READY_TO_PICKUP']
            if (!validStatuses.includes(updatedOrder.status)) {
              set({ orders: orders.filter((o) => o.id !== updatedOrder.id) })
            } else {
              set({ orders: orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)) })
            }
          }
        })

        set({ socket })
      },

      disconnectSocket: () => {
        const socket = get().socket
        const abortController = get().abortController
        if (abortController) abortController.abort()
        if (socket) {
          socket.removeAllListeners()
          socket.disconnect()
          set({ socket: null, abortController: null })
        }
      },

      setFilter: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      setDashboardFilter: (newFilters) =>
        set((state) => ({ dashboard_filters: { ...state.dashboard_filters, ...newFilters } })),

      fetchOrders: async () => {
        const { isLoading } = get()
        if (isLoading) return

        const prevAbortController = get().abortController
        if (prevAbortController) prevAbortController.abort()

        const abortController = new AbortController()

        try {
          set({ isLoading: true, abortController })
          const { filters } = get()
          const pageBeforeFetch = get().currentPage
          const res = await orderService.adminList({ ...filters, signal: abortController.signal } as any)
          const pageAfterFetch = get().currentPage
          if (pageBeforeFetch !== pageAfterFetch) {
            set({ isLoading: false })
            return
          }
          set({ orders: res.Orders || [], isLoading: false })
        } catch (err: any) {
          if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
            console.error('❌ Fetch Error:', err)
          }
          set({ isLoading: false })
        }
      },

      approveOrder: async (id) => {
        const prev = get().orders
        set({ orders: prev.filter((o) => o.id !== id) })
        try {
          await orderService.approve(id)
          return { success: true }
        } catch (error: any) {
          set({ orders: prev })
          alert('เกิดข้อผิดพลาดในการอนุมัติ: ' + error.message)
          return { success: false }
        }
      },

      rejectOrder: async (id, reason) => {
        const prev = get().orders
        set({ orders: prev.filter((o) => o.id !== id) })
        try {
          await orderService.reject(id, reason)
          return { success: true }
        } catch (error: any) {
          set({ orders: prev })
          alert('เกิดข้อผิดพลาดในการปฏิเสธ: ' + error.message)
          return { success: false }
        }
      },

      updateOrderStatus: async (id, newStatus) => {
        const prevOrders = get().orders
        if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
          set({ orders: prevOrders.filter((o) => o.id !== id) })
        } else {
          set({ orders: prevOrders.map((o) => (o.id === id ? { ...o, status: newStatus as any } : o)) })
        }
        try {
          await orderService.updateStatus(id, newStatus)
        } catch {
          set({ orders: prevOrders })
          alert('อัปเดตสถานะไม่สำเร็จ')
        }
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ filters: state.filters }),
    }
  )
)
