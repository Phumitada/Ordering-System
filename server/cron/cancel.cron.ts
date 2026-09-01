import cron from 'node-cron'
import { prisma } from '../db/prisma'
import { io } from '../socket/socket'

// เดิม: cron/cancel.js — ทุก 1 นาที เช็คออเดอร์ที่ยังไม่จ่ายเงินและหมดเวลาถือของแล้ว (10 นาที) -> ยกเลิก + คืนสต็อกที่จองไว้
export const initAutoCancelCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date()
      const expiredOrders = await prisma.order.findMany({
        where: { status: 'PENDING_PAYMENT', expireAt: { lte: now } },
        include: { items: true },
      })

      for (const order of expiredOrders) {
        await prisma.$transaction(async (tx) => {
          for (const item of order.items) {
            await tx.dailyInventory.updateMany({
              where: { productId: item.productId, date: order.pickupDate },
              data: { reservedQty: { decrement: item.quantity } },
            })
          }
          await tx.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } })
        })

        if (io) {
          io.to('admin_room').emit('orderUpdated', { ...order, status: 'CANCELLED' })
        }
      }
    } catch (error) {
      console.error('❌ Error in Auto-Cancel Cron:', error)
    }
  })
}
