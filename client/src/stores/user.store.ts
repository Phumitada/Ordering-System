import { create } from 'zustand'
import { userService } from '@/api/services/user.service'
import type { AdminUser } from '@/types/user.type'

interface UsersState {
  users: AdminUser[]
  isLoading: boolean
  isError: boolean
  errorMsg: string
  fetchUsers: () => Promise<void>
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  isLoading: false,
  isError: false,
  errorMsg: '',
  fetchUsers: async () => {
    try {
      set({ isLoading: true, isError: false, errorMsg: '' })
      const users = await userService.list()
      set({ users: users || [], isLoading: false })
    } catch (error: any) {
      set({ isLoading: false, isError: true, errorMsg: error.message || 'โหลดข้อมูลไม่สำเร็จ' })
    }
  },
}))
