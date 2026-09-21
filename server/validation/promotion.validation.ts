import { z } from 'zod'

// ข้อมูลมาจาก multipart/form-data เหมือน product เลยใช้ z.coerce แปลง boolean จาก string
export const createPromotionSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่อโปรโมชั่น'),
  description: z.string().optional(),
  badge_text: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
})

export const updatePromotionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  badge_text: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
})
