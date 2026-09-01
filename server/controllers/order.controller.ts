import { Response } from 'express'
import { orderService } from '../services/order.service'
import { AuthRequest } from '../middleware/auth.middleware'

export const orderController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.create(req.user.userId, req.body)
      res.status(201).json({ message: 'จองสินค้าสำเร็จ! กรุณาชำระเงินภายใน 10 นาที', order })
    } catch (error: any) {
      console.error('Create Order Error:', error)
      res.status(400).json({ message: error.message })
    }
  },

  confirmPayment: async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.confirmPayment(req.params.id, req.user.userId, req.file)
      res.status(200).json({ message: 'แจ้งชำระเงินเรียบร้อยแล้ว รอทางร้านตรวจสอบ', order })
    } catch (error: any) {
      console.error('Payment Error:', error)
      const status = error.message === 'ไม่มีสิทธิ์เข้าถึงออเดอร์นี้' ? 403 : 400
      res.status(status).json({ message: error.message })
    }
  },

  // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ)
  myOrders: async (req: AuthRequest, res: Response) => {
    try {
      const result = await orderService.myOrders(req.user.userId, req.query as any)
      res.status(200).json({
        Orders: result.orders,
        totalOrders: result.totalOrders,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ)
  getById: async (req: AuthRequest, res: Response) => {
    try {
      const isAdmin = req.user.role === 'ADMIN'
      const order = await orderService.getById(req.params.id, req.user.userId, isAdmin)
      res.status(200).json(order)
    } catch (error: any) {
      const status = error.message === 'ไม่มีสิทธิ์เข้าถึงออเดอร์นี้' ? 403 : 404
      res.status(status).json({ message: error.message })
    }
  },

  adminList: async (req: AuthRequest, res: Response) => {
    try {
      const result = await orderService.adminList(req.query as any)
      res.status(200).json({
        Orders: result.orders,
        totalOrders: result.totalOrders,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  },

  approve: async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.approve(req.params.id, req.user.userId)
      res.status(200).json({ message: 'อนุมัติออเดอร์เรียบร้อย!', order })
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 400
      res.status(status).json({ message: error.message })
    }
  },

  reject: async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.reject(req.params.id, req.body.reason)
      res.status(200).json({ message: 'ยกเลิกออเดอร์แล้ว', order })
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 400
      res.status(status).json({ message: error.message })
    }
  },

  updateStatus: async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body.status)
      res.status(200).json({ message: 'อัปเดตสถานะเรียบร้อย', order })
    } catch (error: any) {
      const status = error.message === 'Order not found' ? 404 : 400
      res.status(status).json({ message: error.message })
    }
  },
}
