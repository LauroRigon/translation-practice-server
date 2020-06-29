import TranslationController from './TranslationController'
import { hasDifferentLang, hasName, injectTranslation } from './TranslationMiddlewares'

export default (router) => {
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

  router.patch(
    '/translation/:id',
    injectTranslation,
    hasDifferentLang,
    hasName,
    AppTranslationController.update
  )
}
