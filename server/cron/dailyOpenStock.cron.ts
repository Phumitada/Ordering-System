import cron from 'node-cron'
import { inventoryService } from '../services/inventory.service'

// เดิม: cron/daily_order.js — ทุกวัน 04:30 (เวลาไทย) เปิดคลังสินค้าล่วงหน้าให้สินค้าที่ยังขายอยู่ทั้งหมด
export const initStockOpenCron = () => {
  cron.schedule(
    '30 4 * * *',
    async () => {
      try {
        const today = new Date()
        const dateStr = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
        await inventoryService.openAllInventory(dateStr)
      } catch (error) {
        console.error('❌ Cron Job Error:', error)
      }
    },
    { timezone: 'Asia/Bangkok' }
  )
}
