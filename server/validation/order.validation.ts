import { z } from 'zod'

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
        custom_note: z.string().optional(),
      })
    )
    .min(1, 'ตะกร้าสินค้าว่างเปล่า'),
  pickup_date: z.string().min(1),
  fulfillment_type: z.enum(['PICKUP', 'DELIVERY']),
  delivery_info: z
    .object({
      recipient_name: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      rider_note: z.string().optional(),
    })
    .optional(),
  shop_note: z.string().optional(),
})

export const rejectOrderSchema = z.object({
  reason: z.string().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'WAITING_FOR_VERIFICATION',
    'READY_TO_PICKUP',
    'DELIVERING',
    'COMPLETED',
    'CANCELLED',
  ]),
})
