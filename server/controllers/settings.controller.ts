import { Request, Response } from 'express'
import { settingsService } from '../services/settings.service'

export const settingsController = {
  get: async (req: Request, res: Response) => {
    try {
      const settings = await settingsService.get()
      res.status(200).json(settings)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const settings = await settingsService.update(req.body)
      res.status(200).json({ message: 'บันทึกการตั้งค่าสำเร็จ', settings })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },
}
