import { Router } from 'express'

import AuthRoutes from './controllers/Auth/AuthRoutes'
import TranslationRoutes from './controllers/Translation/TranslationRoutes'

const router = Router()

AuthRoutes(router)
TranslationRoutes(router)

export default router
