import { Request, Response } from 'express'
import { promotionService } from '../services/promotion.service'

export const promotionController = {
  create: async (req: Request, res: Response) => {
    try {
      const promotion = await promotionService.create(req.body, req.file)
      res.status(201).json({ message: 'เพิ่มโปรโมชั่นสำเร็จ', promotion })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const promotions = await promotionService.listActive()
      res.status(200).json(promotions)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  adminList: async (req: Request, res: Response) => {
    try {
      const promotions = await promotionService.listAll()
      res.status(200).json(promotions)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const promotion = await promotionService.update(req.params.id, req.body, req.file)
      res.status(200).json({ message: 'แก้ไขโปรโมชั่นสำเร็จ', promotion })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await promotionService.remove(req.params.id)
      res.status(200).json({ message: 'ลบโปรโมชั่นสำเร็จ' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
