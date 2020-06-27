import Translation from '@models/Translation'

export async function injectTranslation (req, res, next) {
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
