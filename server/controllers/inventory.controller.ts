import { Request, Response } from 'express'
import { inventoryService } from '../services/inventory.service'

export const inventoryController = {
  openStock: async (req: Request, res: Response) => {
    try {
      const data = await inventoryService.openStock(req.body)
      res.status(200).json({ message: `เปิดคลังสินค้าวันที่ ${req.body.date} เรียบร้อยแล้ว`, data })
    } catch (error: any) {
      console.error('Open Stock Error:', error)
      res.status(500).json({ message: error.message })
    }
  },

  getByDate: async (req: Request, res: Response) => {
    try {
      const { date } = req.query
      if (!date) {
        res.status(400).json({ message: 'กรุณาระบุวันที่ (Query Param)' })
        return
      }
      const stocks = await inventoryService.getByDate(date as string)
      res.status(200).json(stocks)
    } catch (error: any) {
      console.error('Get Stock Error:', error)
      res.status(500).json({ message: error.message })
    }
  },
}
