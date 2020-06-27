import faker from 'faker'
import { Languages } from '@models/Translation'

export function randomTranslation (mergeAttrs = {}) {
  return {
    name: faker.name.firstName(),
    fromLang: Languages.En,
    toLang: Languages.Ptbr,
    originalText: faker.lorem.words(200),

    ...mergeAttrs
  }
}

export default {
  randomTranslation
}
