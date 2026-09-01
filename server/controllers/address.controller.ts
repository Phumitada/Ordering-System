import { Response } from 'express'
import { addressService } from '../services/address.service'
import { AuthRequest } from '../middleware/auth.middleware'

export const addressController = {
  list: async (req: AuthRequest, res: Response) => {
    try {
      const addresses = await addressService.list(req.user.userId)
      res.status(200).json(addresses)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  create: async (req: AuthRequest, res: Response) => {
    try {
      const address = await addressService.create(req.user.userId, req.body)
      res.status(201).json({ message: 'เพิ่มที่อยู่สำเร็จ', address })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const address = await addressService.update(req.user.userId, req.params.id, req.body)
      res.status(200).json({ message: 'แก้ไขที่อยู่สำเร็จ', address })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  remove: async (req: AuthRequest, res: Response) => {
    try {
      await addressService.remove(req.user.userId, req.params.id)
      res.status(200).json({ message: 'ลบที่อยู่สำเร็จ' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },
}
