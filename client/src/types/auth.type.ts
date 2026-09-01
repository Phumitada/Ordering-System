export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  role: 'USER' | 'ADMIN'
  createdAt?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  phoneNumber: string
}
