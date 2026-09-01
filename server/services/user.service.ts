import { prisma } from '../db/prisma'

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

export const userService = {
  // เดิม: getUsers()
  list: async () => {
    return prisma.user.findMany({ select: userPublicSelect, orderBy: { createdAt: 'desc' } })
  },

  // เดิม: updateUserRole() — มีอยู่ใน controller เดิมแต่ไม่ได้ผูก route ไว้ เพิ่ม route ให้ใช้งานได้จริง
  updateRole: async (id: string, role: 'USER' | 'ADMIN') => {
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('User not found')
    }
    return prisma.user.update({ where: { id }, data: { role }, select: userPublicSelect })
  },

  // เดิม: deleteUser()
  remove: async (id: string) => {
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('User not found')
    }
    await prisma.user.delete({ where: { id } })
  },
}
