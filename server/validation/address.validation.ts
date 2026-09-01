import { z } from 'zod'

export const createAddressSchema = z.object({
  label: z.string().min(1).optional(),
  recipient_name: z.string().optional(),
  phone: z.string().optional(),
  address_line: z.string().min(1, 'กรุณากรอกที่อยู่'),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
})

export const updateAddressSchema = z.object({
  label: z.string().min(1).optional(),
  recipient_name: z.string().optional(),
  phone: z.string().optional(),
  address_line: z.string().min(1).optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
})
