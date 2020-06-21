const mongoose = require('mongoose')

export const LANG_PTBR = 1
export const LANG_EN = 2

export const LANG_LIST = {
  [LANG_EN]: 'PT-BR',
  [LANG_PTBR]: 'EN'
}

const transationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromLang: {
    type: Number,
    required: true
  },
  toLang: {
    type: Number,
    required: true
  },
  audioFile: {
    type: String
  },
  originalText: {
    type: String,
    required: false
  },
  translationText: {
    type: String,
    required: false
  },
  translationInvertedText: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Translation = mongoose.model('Translation', transationSchema)

export default Translation

// module.exports = {
//     LANG_PTBR,
//     LANG_EN,
//     LANG_LIST,
//     Translation: mongoose.model('Translation', transationSchema),
// };
