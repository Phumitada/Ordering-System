import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/api/services/auth.service'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.type'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isCheckingAuth: boolean
  isLoading: boolean
  errorMsg: string | null

  login: (payload: LoginPayload) => Promise<boolean>
  registration: (payload: RegisterPayload) => Promise<boolean>
  logout: () => Promise<void>
  checkMe: () => Promise<boolean>
  clearError: () => void
  setAccessToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      isLoading: false,
      errorMsg: null,

      // เดิม: login() ใน useAuthStore.js
      login: async (payload) => {
        set({ isLoading: true, errorMsg: null })
        try {
          const { user, accessToken } = await authService.login(payload)
          set({ user, accessToken, isAuthenticated: true, isLoading: false, isCheckingAuth: false })
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'เข้าสู่ระบบไม่สำเร็จ'
          set({ isLoading: false, errorMsg: message })
          return false
        }
      },

      // เดิม: registration()
      registration: async (payload) => {
        set({ isLoading: true, errorMsg: null })
        try {
          await authService.register(payload)
          set({ isLoading: false })
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || 'Signup failed'
          set({ isLoading: false, errorMsg: message })
          return false
        }
      },

      // เดิม: logout()
      logout: async () => {
        set({ isLoading: true })
        try {
          await authService.logout()
        } catch {
          // เพิกเฉย error ตอน logout เหมือนเดิม
        }
        get().clearAuth()
      },

      // เดิม: checkMe() — ตอนนี้ role admin เช็คแยกที่ ProtectedRoute/AdminGuard แทน (แยกความรับผิดชอบชัดเจนขึ้น)
      checkMe: async () => {
        set({ isCheckingAuth: true })
        try {
          const user = await authService.getMe()
          set({ user, isAuthenticated: true, isCheckingAuth: false })
          return true
        } catch {
          set({ user: null, isAuthenticated: false, isCheckingAuth: false })
          return false
        }
      },

      clearError: () => set({ errorMsg: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false, isCheckingAuth: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
