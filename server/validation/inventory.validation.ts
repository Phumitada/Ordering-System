import { z } from 'zod'

export const openStockSchema = z.object({
  date: z.string().min(1, 'กรุณาระบุวันที่และรายการสินค้า'),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
      })
    )
    .min(1, 'กรุณาระบุวันที่และรายการสินค้า'),
})
