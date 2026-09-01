import { create } from 'zustand'
import { addressService } from '@/api/services/address.service'
import type { Address, AddressPayload } from '@/types/address.type'

interface AddressState {
  addresses: Address[]
  isLoading: boolean
  fetchAddresses: () => Promise<void>
  addAddress: (payload: AddressPayload) => Promise<boolean>
  updateAddress: (id: string, payload: Partial<AddressPayload>) => Promise<boolean>
  deleteAddress: (id: string) => Promise<boolean>
}

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — คู่กับ Address module ฝั่ง backend ที่เพิ่งเปิดใช้งาน
export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    try {
      set({ isLoading: true })
      const addresses = await addressService.list()
      set({ addresses, isLoading: false })
    } catch (error) {
      console.error(error)
      set({ isLoading: false })
    }
  },

  addAddress: async (payload) => {
    try {
      await addressService.create(payload)
      await get().fetchAddresses()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },

  updateAddress: async (id, payload) => {
    try {
      await addressService.update(id, payload)
      await get().fetchAddresses()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },

  deleteAddress: async (id) => {
    try {
      await addressService.remove(id)
      await get().fetchAddresses()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
}))
