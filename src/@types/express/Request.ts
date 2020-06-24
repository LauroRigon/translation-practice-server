import User from '@models/User'

declare global {
  interface Request {
    user: typeof User
  }
}
