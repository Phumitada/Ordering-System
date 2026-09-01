import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { addressController } from '../controllers/address.controller'
import { createAddressSchema, updateAddressSchema } from '../validation/address.validation'

const router = Router()

// ทุก endpoint ต้อง login และเห็นเฉพาะที่อยู่ของตัวเอง (scope ด้วย req.user.userId ใน service ทุกจุด)
router.get('/', authenticate, addressController.list as any)
router.post('/', authenticate, validate(createAddressSchema), addressController.create as any)
router.patch('/:id', authenticate, validate(updateAddressSchema), addressController.update as any)
router.delete('/:id', authenticate, addressController.remove as any)

export default router
