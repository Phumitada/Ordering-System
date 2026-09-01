import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { userController } from '../controllers/user.controller'

const router = Router()

router.get('/', authenticate, authorize('ADMIN'), userController.list)
// เดิมมี controller updateUserRole/deleteUser อยู่แล้วแต่ไม่ได้ผูก route — เปิดใช้งานให้ครบตาม business logic เดิม
router.patch('/:id/role', authenticate, authorize('ADMIN'), userController.updateRole)
router.delete('/:id', authenticate, authorize('ADMIN'), userController.remove)

export default router
