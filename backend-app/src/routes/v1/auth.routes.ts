import { Router } from 'express'

import { authController } from '../../controllers/auth.controller'
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import { bootstrapValidator, loginValidator } from '../../validators/auth.validators'

const router = Router()

router.post('/auth/bootstrap', bootstrapValidator, validate, authController.bootstrap)
router.post('/auth/login', loginValidator, validate, authController.login)
router.post('/auth/refresh', authController.refresh)
router.post('/auth/logout', authController.logout)
router.get('/auth/me', authMiddleware, requireAdmin, authController.me)
router.post('/auth/verify', authMiddleware, requireAdmin, authController.verify)

export { router as authRoutes }