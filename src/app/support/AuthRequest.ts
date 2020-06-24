import { Request } from 'express'
import { UserInterface } from '@models/User'

export interface AuthRequest extends Request{
  user: UserInterface
}
