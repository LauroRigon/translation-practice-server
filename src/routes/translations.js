const express = require('express')
const router = express.Router()
const {
    Translation,
    LANG_LIST
} = require('../models/translation')

router.get('/', async (req, res) => {
    try {
        const translations = await Translation.find()
        
        res.json(translations)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', injectTranslation, (req, res) => {
    res.json(req.translation)
})

router.post('/', async (req, res) => {
    const translation = new Translation({
        name: req.body.name,
        fromLang: req.body.fromLang,
        toLang: req.body.toLang,
        originalText: req.body.originalText,
    })
   
    try {
        const freshTranslation = await translation.save()
        res.status(201).json(freshTranslation)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/:id', injectTranslation, async (req, res) => {
    const translation = req.translation
    const safeFields = ['name', 'fromLang', 'toLang', 'originalText']

    safeFields.forEach(field => {
        if (req.body[field]) {
            translation[field] = req.body[field]
        }
    });

    try {
        const updatedTranslation = await translation.save()
        res.json(updatedTranslation)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', injectTranslation, async (req, res) => {
    try {
        await req.translation.remove()
        res.json({ message: 'Deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function injectTranslation(req, res, next) {
    let translation;

    try {
        translation = await Translation.findById(req.params.id)
        if (!translation) {
            return res.status(404).json({ message: 'Translation not found!'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    req.translation = translation
    next()
}

module.exports = router