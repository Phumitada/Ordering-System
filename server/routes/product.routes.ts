import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { upload } from '../lib/upload'
import { productController } from '../controllers/product.controller'
import { createProductSchema, updateProductSchema, updateProductStatusSchema } from '../validation/product.validation'

const router = Router()

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(createProductSchema),
  productController.create
)
router.get('/', productController.list)
router.get('/:id', productController.getById)
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('image'),
  validate(updateProductSchema),
  productController.update
)
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductStatusSchema),
  productController.updateStatus
)
router.delete('/:id', authenticate, authorize('ADMIN'), productController.remove)

export default router
