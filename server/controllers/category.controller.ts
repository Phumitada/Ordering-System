import { Request, Response } from 'express'
import { categoryService } from '../services/category.service'

export const categoryController = {
  create: async (req: Request, res: Response) => {
    try {
      await categoryService.create(req.body)
      res.json({ message: 'เพิ่ม Category สำเร็จ' })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.list()
      res.status(200).json(categories)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await categoryService.remove(req.params.id)
      res.status(200).json({ message: 'ลบ Category สำเร็จ' })
    } catch (error: any) {
      const status = error.message.includes('ไม่พบ') ? 404 : 400
      res.status(status).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = await categoryService.update(req.params.id, req.body)
      res.status(200).json({ message: 'แก้ไข Category สำเร็จ', data })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
