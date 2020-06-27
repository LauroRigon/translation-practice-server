import AuthController from './AuthController'

export default (router) => {
  router.post('/auth/register', AuthController.register)
  router.post('/auth/login', AuthController.login)
}
