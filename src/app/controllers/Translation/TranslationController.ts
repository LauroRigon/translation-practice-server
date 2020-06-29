import express, { Response } from 'express'
import Translation from '@models/Translation'
import { AuthRequest } from '../../support/AuthRequest'
import AuthenticatedMiddleware from '../Auth/AuthenticatedMiddleware'

class TranslationController {
  public express: express.Application
  public router: express.Router

  public constructor (router: express.Router) {
    this.router = router
    this.express = express()

    this.middlewares()
  }

  private middlewares () {
    this.router.use(AuthenticatedMiddleware)
  }

  public async index (req: AuthRequest, res: Response): Promise<Response> {
    try {
      const translations = await Translation.find({ user: req.user._id }).populate('user')

      return res.status(200).json(translations)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  public async show (req: AuthRequest, res: Response): Promise<Response> {
    try {
      return res.status(200).send(req.translation.toJSON())
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  public async delete (req: AuthRequest, res: Response): Promise<Response> {
    try {
      await req.translation.remove()
      res.status(200).json({ message: 'Deleted' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  public async create (req: AuthRequest, res: Response): Promise<Response> {
    try {
      const translation = await new Translation({
        name: req.body.name,
        user: req.user._id,
        fromLang: req.body.fromLang,
        toLang: req.body.toLang,
        originalText: req.body.originalText
      })

      const freshTranslation = await translation.save()

      return res.status(201).send(freshTranslation)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  public async update (req: AuthRequest, res: Response): Promise<Response> {
    const translation = req.translation
    const safeFields = ['name', 'fromLang', 'toLang', 'originalText', 'translationText', 'translationInvertedText']

    safeFields.forEach(field => {
      if (req.body[field]) {
        translation[field] = req.body[field]
      }
    })

    try {
      const updatedTranslation = await translation.save()
      return res.status(200).json(updatedTranslation)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

export default (router) => new TranslationController(router)
