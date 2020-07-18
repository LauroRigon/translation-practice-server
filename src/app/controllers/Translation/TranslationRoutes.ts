import TranslationController from './TranslationController'
import { hasDifferentLang, hasName, injectTranslation } from './TranslationMiddlewares'
import { Router } from 'express'
import AuthenticatedMiddleware from '../../middleware/AuthenticatedMiddleware'

export default (router: Router) => {
  const AppTranslationController = TranslationController(router)
  router.get(
    '/translation',
    AuthenticatedMiddleware,
    AppTranslationController.index
  )

  router.get(
    '/translation/:id',
    AuthenticatedMiddleware,
    injectTranslation,
    AppTranslationController.show
  )

  router.delete(
    '/translation/:id',
    AuthenticatedMiddleware,
    injectTranslation,
    AppTranslationController.delete
  )

  router.post(
    '/translation',
    AuthenticatedMiddleware,
    hasDifferentLang,
    hasName,
    AppTranslationController.create
  )

  router.put(
    '/translation/:id',
    AuthenticatedMiddleware,
    injectTranslation,
    hasDifferentLang,
    hasName,
    AppTranslationController.update
  )

  router.patch(
    '/translation/:id',
    AuthenticatedMiddleware,
    injectTranslation,
    AppTranslationController.patch
  )
}
