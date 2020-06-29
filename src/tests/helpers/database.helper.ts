import { Document } from 'mongoose'

export async function expectToExistOnDb (modelObj: Document, modelName) {
  if (await modelObj.model(modelName).exists({ _id: modelObj._id })) {
    // eslint-disable-next-line no-undef
    fail('model exists on db')
  }
}
