import TranslationController from './TranslationController'
import { hasDifferentLang, hasName, injectTranslation } from './TranslationMiddlewares'
import { Router } from 'express'

export default (router: Router) => {
  const AppTranslationController = TranslationController(router)
  router.get(
    '/translation',
    AppTranslationController.index
  )

  router.get(
    '/translation/:id',
    injectTranslation,
    AppTranslationController.show
  )

  router.delete(
    '/translation/:id',
    injectTranslation,
    AppTranslationController.delete
  )

  router.post(
    '/translation',
    hasDifferentLang,
    hasName,
    AppTranslationController.create
  )

  router.put(
    '/translation/:id',
    injectTranslation,
    hasDifferentLang,
    hasName,
    AppTranslationController.update
  )

  router.patch(
    '/translation/:id',
    injectTranslation,
    AppTranslationController.patch
  )
}
