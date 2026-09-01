import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { inventoryController } from '../controllers/inventory.controller'
import { openStockSchema } from '../validation/inventory.validation'

const router = Router()

router.get('/', inventoryController.getByDate)
router.post('/open', authenticate, authorize('ADMIN'), validate(openStockSchema), inventoryController.openStock)

export default router
