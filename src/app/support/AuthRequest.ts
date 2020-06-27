import { Request } from 'express'
import { UserInterface } from '@models/User'
import { TranslationInterface } from '@models/Translation'

export interface AuthRequest extends Request{
  user: UserInterface,
  translation?: TranslationInterface
}
