import { prisma } from '../db/prisma'
import { destroyCloudinaryAsset, getPublicIdFromUrl, uploadBufferToCloudinary } from '../lib/cloudinaryUpload'
import type { CreatePromotionPayload, UpdatePromotionPayload } from '../types/promotion.type'

const PROMOTION_FOLDER = 'promotions'

export const promotionService = {
  // เฉพาะที่เปิดใช้งาน — ใช้แสดงหน้า /promotions ของลูกค้า
  listActive: async () => {
    return prisma.promotion.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })
  },

  // ทั้งหมด (รวมที่ปิดใช้งาน) — เฉพาะ admin
  listAll: async () => {
    return prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  },

  create: async (body: CreatePromotionPayload, file?: Express.Multer.File) => {
    if (!file) {
      throw new Error('กรุณาอัปโหลดรูปภาพโปรโมชั่น')
    }
    const imageUrl = await uploadBufferToCloudinary(file, PROMOTION_FOLDER)

    return prisma.promotion.create({
      data: {
        title: body.title,
        description: body.description ?? '',
        badgeText: body.badge_text ?? '',
        isActive: body.is_active ?? true,
        image: imageUrl,
      },
    })
  },

  update: async (id: string, body: UpdatePromotionPayload, file?: Express.Multer.File) => {
    const promotion = await prisma.promotion.findUnique({ where: { id } })
    if (!promotion) {
      throw new Error('ไม่พบโปรโมชั่นนี้')
    }

    let image = promotion.image
    if (file) {
      const oldPublicId = getPublicIdFromUrl(promotion.image, PROMOTION_FOLDER)
      await destroyCloudinaryAsset(oldPublicId)
      image = await uploadBufferToCloudinary(file, PROMOTION_FOLDER)
    }

    return prisma.promotion.update({
      where: { id },
      data: {
        title: body.title ?? promotion.title,
        description: body.description ?? promotion.description,
        badgeText: body.badge_text ?? promotion.badgeText,
        isActive: body.is_active ?? promotion.isActive,
        image,
      },
    })
  },

  remove: async (id: string) => {
    const promotion = await prisma.promotion.findUnique({ where: { id } })
    if (!promotion) {
      throw new Error('ไม่พบโปรโมชั่นนี้')
    }
    const publicId = getPublicIdFromUrl(promotion.image, PROMOTION_FOLDER)
    await destroyCloudinaryAsset(publicId)
    await prisma.promotion.delete({ where: { id } })
  },
}
