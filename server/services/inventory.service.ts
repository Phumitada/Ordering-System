import { prisma } from '../db/prisma'
import type { OpenStockPayload } from '../types/inventory.type'

export const inventoryService = {
  // เดิม: openStock() — เปิดคลังสินค้าตามรายการที่แอดมินเลือกเอง (capacity = default_stock ของสินค้านั้น)
  openStock: async (payload: OpenStockPayload) => {
    const results = []
    for (const item of payload.items) {
      const product = await prisma.product.findUnique({ where: { id: item.product_id } })
      if (!product) continue // เดิมไม่เช็ค แต่ถ้าไม่เจอสินค้าจริงๆ ก็ข้ามแทนที่จะพัง

      const inventory = await prisma.dailyInventory.upsert({
        where: { date_productId: { date: payload.date, productId: item.product_id } },
        create: {
          date: payload.date,
          productId: item.product_id,
          totalCapacity: product.defaultStock,
        },
        update: {
          totalCapacity: product.defaultStock,
        },
      })
      results.push(inventory)
    }
    return results
  },

  // เดิม: getStockByDate()
  getByDate: async (date: string) => {
    const stocks = await prisma.dailyInventory.findMany({
      where: { date },
      include: { product: true },
    })

    return stocks.map((stock) => {
      const available = stock.totalCapacity - (stock.reservedQty + stock.soldQty)
      return {
        id: stock.id,
        product: stock.product,
        stats: {
          capacity: stock.totalCapacity,
          reserved: stock.reservedQty,
          sold: stock.soldQty,
          available: available > 0 ? available : 0,
        },
        status: available > 0 ? 'AVAILABLE' : 'SOLD_OUT',
        date: stock.date,
      }
    })
  },

  // เดิม: OpenAllInventory() — เรียกจาก cron รายวัน เปิดคลังให้สินค้าที่ is_active=true ทุกตัว
  openAllInventory: async (dateStr: string) => {
    const products = await prisma.product.findMany({ where: { isActive: true } })
    const results = []
    for (const product of products) {
      const inventory = await prisma.dailyInventory.upsert({
        where: { date_productId: { date: dateStr, productId: product.id } },
        create: {
          date: dateStr,
          productId: product.id,
          totalCapacity: product.defaultStock,
        },
        update: {
          totalCapacity: product.defaultStock,
        },
      })
      results.push(inventory)
    }
    return results
  },
}
