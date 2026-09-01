import bcrypt from 'bcryptjs'
import { prisma } from '../db/prisma'
import redis from '../db/redis'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/token'
import type { LoginPayload, RegisterPayload } from '../types/auth.type'

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
  role: true,
  createdAt: true,
}

export const authService = {
  // เดิม: Registration() ใน controller/auth.js
  register: async (payload: RegisterPayload) => {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }],
      },
    })

    if (existing) {
      throw new Error('PhoneNumber or Email already exists')
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10)
    // เดิม: defaultUsername = email.split("@")[0]
    const defaultName = payload.email.split('@')[0]

    const user = await prisma.user.create({
      data: {
        name: defaultName,
        email: payload.email,
        password: hashedPassword,
        phoneNumber: payload.phoneNumber,
      },
      select: userPublicSelect,
    })

    return user
  },

  // เดิม: Login() ใน controller/auth.js
  login: async (payload: LoginPayload) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email } })

    if (!user) {
      throw new Error('Cannot find an email!!')
    }

    const isMatch = await bcrypt.compare(payload.password, user.password)
    if (!isMatch) {
      throw new Error('Invalid Password')
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role })
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role })

    const { password: _pw, ...userWithoutPassword } = user

    return { user: userWithoutPassword, accessToken, refreshToken }
  },

  refresh: async (refreshToken: string) => {
    const isBlacklisted = await redis.get(`blacklist:${refreshToken}`)
    if (isBlacklisted) {
      throw new Error('Token has been revoked')
    }

    const payload = verifyRefreshToken(refreshToken)

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      throw new Error('User not found')
    }

    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role })
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role })

    // revoke ตัวเก่าทันทีที่ใช้แล้ว (rotate) กันเอาไป replay
    await redis.setex(`blacklist:${refreshToken}`, 60 * 60 * 24 * 7, 'true')

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  },

  logout: async (refreshToken: string) => {
    await redis.setex(`blacklist:${refreshToken}`, 60 * 60 * 24 * 7, 'true')
  },

  // เดิม: CheckMe() — ตอนนี้แทนที่ด้วย /me ที่ authenticate middleware แนบ req.user (payload จาก access token) มาให้แล้ว
  // แต่ของเดิม CheckMe คืนข้อมูล user เต็มจาก DB ไม่ใช่แค่ payload ใน token เลย fetch ซ้ำให้ตรงพฤติกรรมเดิม
  me: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userPublicSelect,
    })
    if (!user) {
      throw new Error('User not Found')
    }
    return user
  },
}
