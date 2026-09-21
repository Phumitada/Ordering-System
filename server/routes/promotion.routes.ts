import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { upload } from '../lib/upload'
import { promotionController } from '../controllers/promotion.controller'
import { createPromotionSchema, updatePromotionSchema } from '../validation/promotion.validation'

const router = Router()

router.get('/', promotionController.list)
router.get('/admin/list', authenticate, authorize('ADMIN'), promotionController.adminList)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(createPromotionSchema),
  promotionController.create
)
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(updatePromotionSchema),
  promotionController.update
)
router.delete('/:id', authenticate, authorize('ADMIN'), promotionController.remove)

export default router
