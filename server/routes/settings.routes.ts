import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { settingsController } from '../controllers/settings.controller'
import { updateSettingsSchema } from '../validation/settings.validation'

const router = Router()

// public — ใช้แสดงหน้า Contact ของลูกค้าด้วย
router.get('/', settingsController.get)
router.patch('/', authenticate, authorize('ADMIN'), validate(updateSettingsSchema), settingsController.update)

export default router
