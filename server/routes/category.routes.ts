import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { categoryController } from '../controllers/category.controller'
import { createCategorySchema, updateCategorySchema } from '../validation/category.validation'

const router = Router()

router.post('/', authenticate, authorize('ADMIN'), validate(createCategorySchema), categoryController.create)
// public — หน้าเมนูของลูกค้า (ไม่ต้อง login) ใช้ endpoint นี้แสดงปุ่มกรองหมวดหมู่
router.get('/', categoryController.list)
router.patch('/:id', authenticate, authorize('ADMIN'), validate(updateCategorySchema), categoryController.update)
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.remove)

export default router
