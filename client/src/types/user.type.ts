export interface AdminUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}
