import { Router } from 'express'

import { healthController } from '../../controllers/health.controller'

const router = Router()

router.get('/health', healthController.getStatus)

export { router as healthRoutes }