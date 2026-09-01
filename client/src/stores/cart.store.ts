import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types/product.type'

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  customNote: string
}

interface CartState {
  pickupDate: string
  items: CartItem[]
  addItem: (product: Product, quantity?: number, customNote?: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateNote: (productId: string, note: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setPickupDate: (date: string) => void
  totalItems: () => number
  totalPrice: () => number
}

const getCurrentDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — เดิมไม่มี cart เลยสักบรรทัด (ฝั่งลูกค้าไม่เคยถูก build)
// ตะกร้าผูกกับ pickupDate เดียวเสมอ เพราะสต็อกเปิดแยกรายวัน — เปลี่ยนวันที่ = ล้างตะกร้า (กันสั่งข้ามวันที่สต็อกไม่ตรงกัน)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      pickupDate: getCurrentDate(),
      items: [],

      addItem: (product, quantity = 1, customNote = '') => {
        const existing = get().items.find((i) => i.productId === product.id)
        if (existing) {
          set({
            items: get().items.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i)),
          })
        } else {
          set({
            items: [
              ...get().items,
              { productId: product.id, name: product.name, image: product.image, price: product.price, quantity, customNote },
            ],
          })
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({ items: get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i)) })
      },

      updateNote: (productId, note) => {
        set({ items: get().items.map((i) => (i.productId === productId ? { ...i, customNote: note } : i)) })
      },

      removeItem: (productId) => set({ items: get().items.filter((i) => i.productId !== productId) }),

      clearCart: () => set({ items: [] }),

      setPickupDate: (date) => set({ pickupDate: date, items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
