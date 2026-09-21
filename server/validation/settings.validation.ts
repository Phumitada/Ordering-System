import { z } from 'zod'

export const updateSettingsSchema = z.object({
  shopName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().or(z.literal('')).optional(),
  address: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  facebookUrl: z.string().optional(),
  lineId: z.string().optional(),
  description: z.string().optional(),
})
