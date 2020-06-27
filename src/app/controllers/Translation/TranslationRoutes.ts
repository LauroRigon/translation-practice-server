import TranslationController from './TranslationController'
import { injectTranslation } from './TranslationMiddlewares'

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

  router.post(
    '/translation',
    AppTranslationController.create
  )
}
