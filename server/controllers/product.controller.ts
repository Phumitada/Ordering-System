import { Request, Response } from 'express'
import { productService } from '../services/product.service'

export const productController = {
  create: async (req: Request, res: Response) => {
    try {
      const product = await productService.create(req.body, req.file)
      res.status(201).json({ message: 'เพิ่มสินค้าสำเร็จ', product })
    } catch (error: any) {
      console.error('Error creating product:', error)
      res.status(500).json({ message: error.message })
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const product = await productService.getById(req.params.id)
      res.status(200).json(product)
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const result = await productService.list(req.query as any)
      res.status(200).json(result)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const product = await productService.update(req.params.id, req.body, req.file)
      res.status(200).json({ message: 'อัปเดตสินค้าสำเร็จ', product })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await productService.remove(req.params.id)
      res.status(200).json({ message: 'ลบสินค้าสำเร็จ' })
    } catch (error: any) {
      res.status(404).json({ message: error.message })
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const product = await productService.updateStatus(req.params.id, req.body.is_active)
      res.status(200).json({ message: 'อัปเดตสถานะสำเร็จ', product })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },
}
