import Translation from '@models/Translation'
import { AuthRequest } from '../../support/AuthRequest'
import { RequestHandler, Response } from 'express'
import multer from 'multer'

export async function injectTranslation (req: AuthRequest, res: Response, next) {
  let translation

  try {
    translation = await Translation.findById(req.params.id).populate('user')
    if (!translation) {
      return res.status(404).json({ message: 'Translation not found!' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }

  req.translation = translation
  next()
}

export const uploadAudioFile = ((): RequestHandler => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + file.originalname)
    }
  })

  const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter (req: AuthRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) {
      if (file.mimetype.split('/')[0] === 'audio') {
        cb(null, true)
      } else {
        cb(new Error('File type wrong'))
      }
    }
  })

  return upload.single('audioFile')
})()

export function hasDifferentLang ({ body }: AuthRequest, res: Response, next) {
  const error = {
    field: 'fromLang',
    error: 'Languages has to be different from each other'
  }
  console.log(body)
  if (body.fromLang === body.toLang) {
    return res.status(400).json(error)
  }

  next()
}

export function hasName ({ body }: AuthRequest, res: Response, next) {
  const error = {
    field: 'name',
    error: 'Translation has to have a name'
  }

  if (!body.name) {
    return res.status(400).json(error)
  }

  next()
}
