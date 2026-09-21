import { prisma } from '../db/prisma'
import type { UpdateSettingsPayload } from '../types/settings.type'

const SETTINGS_ID = 'shop-settings'

export const settingsService = {
  get: async () => {
    const settings = await prisma.shopSetting.findUnique({ where: { id: SETTINGS_ID } })
    if (settings) return settings
    return prisma.shopSetting.create({ data: { id: SETTINGS_ID } })
  },

  update: async (payload: UpdateSettingsPayload) => {
    return prisma.shopSetting.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, ...payload },
      update: payload,
    })
  },
}
