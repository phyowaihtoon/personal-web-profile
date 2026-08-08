import { Router } from 'express'

import { adminRoutes } from './admin.routes'
import { authRoutes } from './auth.routes'
import { healthRoutes } from './health.routes'
import { publicRoutes } from './public.routes'

const router = Router()

router.use(adminRoutes)
router.use(authRoutes)
router.use(healthRoutes)
router.use(publicRoutes)

export { router as v1Routes }