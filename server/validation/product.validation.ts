import { z } from 'zod'

// ข้อมูลมาจาก multipart/form-data (Create/Update product) ทุก field เลยเป็น string ตั้งต้น
// ใช้ z.coerce เพื่อแปลงเป็น number/boolean ให้อัตโนมัติ เหมือน behaviour เดิมที่ backend รับ req.body ตรงๆ
export const createProductSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกข้อมูลสำคัญให้ครบ (ชื่อ,ราคา,หมวดหมู่)'),
  description: z.string().optional(),
  price: z.coerce.number().positive('กรุณากรอกข้อมูลสำคัญให้ครบ (ชื่อ,ราคา,หมวดหมู่)'),
  category: z.string().min(1, 'กรุณากรอกข้อมูลสำคัญให้ครบ (ชื่อ,ราคา,หมวดหมู่)'),
  default_stock: z.coerce.number().int().nonnegative().optional(),
})

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  category: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
  default_stock: z.coerce.number().int().nonnegative().optional(),
  recommend: z.string().optional(),
})

export const updateProductStatusSchema = z.object({
  is_active: z.coerce.boolean(),
})
