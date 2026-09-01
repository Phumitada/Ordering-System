import { prisma } from '../db/prisma'
import type { CreateAddressPayload, UpdateAddressPayload } from '../types/address.type'

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — Mongoose schema เดิมมี User.addresses (embedded array) นิยามไว้
// แต่ไม่เคยมี controller/route ใช้งานจริงเลยสักจุด ตอนนี้เปิดใช้งานให้ครบผ่านตาราง `addresses` แยก
export const addressService = {
  list: async (userId: string) => {
    return prisma.address.findMany({ where: { userId }, orderBy: { id: 'asc' } })
  },

  create: async (userId: string, payload: CreateAddressPayload) => {
    return prisma.address.create({
      data: {
        userId,
        label: payload.label || 'Home',
        recipientName: payload.recipient_name,
        phone: payload.phone,
        addressLine: payload.address_line,
        lat: payload.lat,
        lng: payload.lng,
      },
    })
  },

  update: async (userId: string, id: string, payload: UpdateAddressPayload) => {
    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      throw new Error('ไม่พบที่อยู่นี้')
    }

    return prisma.address.update({
      where: { id },
      data: {
        label: payload.label ?? existing.label,
        recipientName: payload.recipient_name ?? existing.recipientName,
        phone: payload.phone ?? existing.phone,
        addressLine: payload.address_line ?? existing.addressLine,
        lat: payload.lat ?? existing.lat,
        lng: payload.lng ?? existing.lng,
      },
    })
  },

  remove: async (userId: string, id: string) => {
    const existing = await prisma.address.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      throw new Error('ไม่พบที่อยู่นี้')
    }
    await prisma.address.delete({ where: { id } })
  },
}
