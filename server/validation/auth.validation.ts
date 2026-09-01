import { z } from 'zod'

// เดิม backend เช็คด้วย regex เอง — ย้ายมาไว้ที่ zod schema แทน (logic เดิมทุกจุด)
export const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phoneNumber: z.string().min(1, 'PhoneNum is required'),
})

export const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'email and password are required'),
})
