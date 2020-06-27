import { Schema, model, Document } from 'mongoose'

export const LANG_PTBR = 1
export const LANG_EN = 2

export enum Languages {
  Ptbr = LANG_PTBR,
  En = LANG_EN,
}

export interface TranslationInterface extends Document {
  name: string;
  user: number;
  fromLang: Languages;
  toLang: Languages;
  audioFile?: string;
  originalText: string;
  translationText?: string;
  translationInvertedText?: string;

  readonly fromLangLabel?: string
  readonly toLangLabel?: string
}

const TranslationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromLang: {
    type: Languages,
    required: true
  },
  toLang: {
    type: Languages,
    required: true
  },
  audioFile: {
    type: String
  },
  originalText: {
    type: String,
    required: true
  },
  translationText: {
    type: String
  },
  translationInvertedText: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

TranslationSchema.virtual('fromLangLabel').get(function () { return Languages[this.fromLang] })
TranslationSchema.virtual('toLangLabel').get(function () { return Languages[this.toLang] })

export default model<TranslationInterface>('Translation', TranslationSchema)
