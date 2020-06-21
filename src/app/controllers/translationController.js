const express = require('express');
const router = express.Router();
const multer = require('multer');

const authMiddleware = require('../middleware/auth');

const { Translation, LANG_LIST } = require('../models/translation');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] == 'audio') {
        cb(null, true);
    } else {
        cb(new Error('File type wrong'), false);
    }
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        let  translations = await Translation.find({user: req.user._id}).populate('user');
        translations = translations.map(translation => {
            translation.fromLang = LANG_LIST[translation.fromLang];
            translation.toLang = LANG_LIST[translation.toLang];

            return translation.toJSON();
        });

        res.status(200).json(translations)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', injectTranslation, (req, res) => {
    res.json(req.translation);
});

router.post('/', upload.single('audioFile'), async (req, res) => {
    console.log(req.file);
    
    const translation = new Translation({
        name: req.body.name,
        user: req.user._id,
        fromLang: req.body.fromLang,
        toLang: req.body.toLang,
        originalText: req.body.originalText,
        audioFile: req.file.path,
    });

    try {
        const freshTranslation = await translation.save();
        res.status(201).json(freshTranslation)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/:id',  upload.single('audioFile'), injectTranslation, async (req, res) => {
    const translation = req.translation;
    const safeFields = ['name', 'fromLang', 'toLang', 'originalText', 'translationText', 'translationInvertedText'];

    safeFields.forEach(field => {
        if (req.body[field]) {
            translation[field] = req.body[field]
        }
    });

    try {
        const updatedTranslation = await translation.save();
        res.json(updatedTranslation)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', injectTranslation, async (req, res) => {
    try {
        await req.translation.remove();
        res.json({ message: 'Deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

async function injectTranslation(req, res, next) {
    let translation;

    try {
        translation = await Translation.findById(req.params.id).populate('user');
        if (!translation) {
            return res.status(404).json({ message: 'Translation not found!'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    req.translation = translation;
    next();
}

module.exports = app => app.use('/translation', router);