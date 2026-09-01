import { prisma } from '../db/prisma'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.type'

export const categoryService = {
  // เดิม: AddCategory()
  create: async (payload: CreateCategoryPayload) => {
    return prisma.category.create({
      data: { name: payload.name, isActive: true },
    })
  },

  // เดิม: GetCategory() — ใช้ Mongo $lookup + $size นับจำนวนสินค้าในหมวด
  // Prisma: ใช้ _count relation แทน aggregate ได้ผลลัพธ์เดียวกัน
  list: async () => {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      isActive: c.isActive,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      productsCount: c._count.products,
    }))
  },

  // เดิม: DeleteCategory() — กันลบถ้ายังมีสินค้าอยู่ในหมวด
  remove: async (id: string) => {
    const productCount = await prisma.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      throw new Error(
        `ไม่สามารถลบได้ เนื่องจากมีสินค้า ${productCount} รายการอยู่ในหมวดนี้ กรุณาย้ายสินค้าออกก่อน`
      )
    }

    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('ไม่พบหมวดหมู่ที่จะลบ')
    }

    await prisma.category.delete({ where: { id } })
  },

  // เดิม: UpdateCategory()
  update: async (id: string, payload: UpdateCategoryPayload) => {
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      throw new Error('ไม่พบหมวดหมู่นี้')
    }

    return prisma.category.update({
      where: { id },
      data: {
        name: payload.name ?? existing.name,
        isActive: payload.isActive ?? existing.isActive,
      },
    })
  },
}
