import { prisma } from '../db/prisma'
import { destroyCloudinaryAsset, getPublicIdFromUrl, uploadBufferToCloudinary } from '../lib/cloudinaryUpload'
import type { ProductQuery, UpdateProductPayload } from '../types/product.type'

const PRODUCT_FOLDER = 'products'

export const productService = {
  // เดิม: Create_Product()
  create: async (
    body: { name: string; description?: string; price: number; category: string; default_stock?: number },
    file?: Express.Multer.File
  ) => {
    if (!file) {
      throw new Error('กรุณาอัปโหลดรูปภาพสินค้า')
    }

    const imageUrl = await uploadBufferToCloudinary(file, PRODUCT_FOLDER)

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: imageUrl,
        categoryId: body.category,
        defaultStock: body.default_stock ?? 20,
      },
    })

    return product
  },

  // เดิม: Show_Product_Id()
  getById: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new Error('ไม่พบสินค้า')
    }
    return product
  },

  // เดิม: Show_Product() — filter/search/sort/pagination + populate category
  list: async (query: ProductQuery) => {
    const {
      category,
      search,
      limit = '10',
      page = '1',
      sort = 'createdAt',
      order = 'desc',
      is_active,
    } = query

    const where: any = {}
    if (category && category !== 'ทั้งหมด') where.categoryId = category
    if (search) where.name = { contains: search, mode: 'insensitive' }
    if (is_active !== undefined) where.isActive = is_active === 'true'

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sort]: order === 'desc' ? 'desc' : 'asc' },
        skip,
        take: limitNum,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      totalProducts: total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    }
  },

  // เดิม: Update_Product() — เปลี่ยนรูปใหม่แล้วลบรูปเก่าทิ้งจาก Cloudinary
  update: async (id: string, body: UpdateProductPayload, file?: Express.Multer.File) => {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new Error('ไม่พบสินค้า')
    }

    let image = product.image
    if (file) {
      const oldPublicId = getPublicIdFromUrl(product.image, PRODUCT_FOLDER)
      await destroyCloudinaryAsset(oldPublicId)
      image = await uploadBufferToCloudinary(file, PRODUCT_FOLDER)
    }

    return prisma.product.update({
      where: { id },
      data: {
        name: body.name ?? product.name,
        description: body.description ?? product.description,
        price: body.price ?? product.price,
        categoryId: body.category ?? product.categoryId,
        isActive: body.is_active ?? product.isActive,
        defaultStock: body.default_stock ?? product.defaultStock,
        recommend: body.recommend ?? product.recommend,
        image,
      },
    })
  },

  // เดิม: Delete_Product()
  remove: async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new Error('ไม่พบสินค้า')
    }
    const publicId = getPublicIdFromUrl(product.image, PRODUCT_FOLDER)
    await destroyCloudinaryAsset(publicId)
    await prisma.product.delete({ where: { id } })
  },

  // เดิม: Status_update()
  updateStatus: async (id: string, isActive: boolean) => {
    return prisma.product.update({
      where: { id },
      data: { isActive },
    })
  },
}
