import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { upload } from '../lib/upload'
import { orderController } from '../controllers/order.controller'
import { createOrderSchema, rejectOrderSchema, updateOrderStatusSchema } from '../validation/order.validation'
import { AuthRequest } from '../middleware/auth.middleware'

const router = Router()

router.post('/', authenticate, validate(createOrderSchema), orderController.create as any)
router.put('/:id/pay', authenticate, upload.single('slip'), orderController.confirmPayment as any)

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ต้องมาก่อน '/:id' ไม่งั้น express จะจับ 'my' เป็นค่า :id แทน
router.get('/my', authenticate, orderController.myOrders as any)
router.get('/:id', authenticate, orderController.getById as any)


router.get('/admin/list', authenticate, authorize('ADMIN'), orderController.adminList as any)
router.put('/admin/:id/approve', authenticate, authorize('ADMIN'), orderController.approve as any)
router.put(
  '/admin/:id/reject',
  authenticate,
  authorize('ADMIN'),
  validate(rejectOrderSchema),
  orderController.reject as any
)
router.put(
  '/admin/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateStatus as any
)

export default router
