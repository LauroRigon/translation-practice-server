import { Router } from 'express'

import AuthController from './controllers/Auth/AuthController'
import TranslationController from './controllers/Translation/TranslationController'

const router = Router()

router.post('/auth/register', AuthController.register)
router.post('/auth/login', AuthController.login)

const AppTranslationController = TranslationController(router)
router.get('/translation', AppTranslationController.index)
router.post('/translation', AppTranslationController.create)

export default router
