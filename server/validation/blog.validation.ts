import { z } from 'zod'

export const createBlogSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกหัวข้อบทความ'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'กรุณากรอกเนื้อหาบทความ'),
  is_published: z.coerce.boolean().optional(),
})

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  is_published: z.coerce.boolean().optional(),
})
