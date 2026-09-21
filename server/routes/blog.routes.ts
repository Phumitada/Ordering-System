import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { upload } from '../lib/upload'
import { blogController } from '../controllers/blog.controller'
import { createBlogSchema, updateBlogSchema } from '../validation/blog.validation'

const router = Router()

router.get('/', blogController.list)
// ต้องมาก่อน '/:slug' ไม่งั้น express จะจับ 'admin' เป็นค่า :slug แทน
router.get('/admin/list', authenticate, authorize('ADMIN'), blogController.adminList)
router.get('/admin/:id', authenticate, authorize('ADMIN'), blogController.getById)
router.get('/:slug', blogController.getBySlug)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('cover'),
  validate(createBlogSchema),
  blogController.create
)
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('cover'),
  validate(updateBlogSchema),
  blogController.update
)
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.remove)

export default router
