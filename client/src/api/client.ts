import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// axiosPublic = ไม่แนบ access token (ใช้กับ /auth/refresh เอง กันเรียกวนซ้ำ)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ต้องมีเพื่อให้ browser แนบ refreshToken cookie อัตโนมัติ
  headers: { 'Content-Type': 'application/json' },
})

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

// เดิม token อยู่ใน httpOnly cookie ตัวเดียว (access+refresh ปนกัน ไม่มีการต่ออายุอัตโนมัติ)
// ตอนนี้แยก: accessToken (15m, อยู่ใน memory/localStorage) + refreshToken (7d, httpOnly cookie)
// เมื่อ accessToken หมดอายุ (401) จะขอ accessToken ใหม่ผ่าน /auth/refresh โดยอัตโนมัติแล้ว retry request เดิม
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const authStore = useAuthStore.getState()

    if (error.response?.status === 401 && !authStore.accessToken) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axiosPublic.post('/auth/refresh', {})
        const { accessToken } = response.data.data
        useAuthStore.getState().setAccessToken(accessToken)
        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
