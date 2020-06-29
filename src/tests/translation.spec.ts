import { config } from 'dotenv'
import supertest from 'supertest'
import server from '../app/server'
import User from '@models/User'
import { generateToken } from '../app/controllers/Auth/AuthController'
import mongoose from 'mongoose'

import TranslationBuilder from './data-builder/translations.builder'
import Translation, { Languages } from '@models/Translation'
import { expectToExistOnDb } from './helpers/database.helper'

const request = supertest(server.express)
config()

let TOKEN
let TEST_USER

describe('Test Translations', () => {
  beforeAll(async (done) => {
    const user = await User.create({ email: 'testauth@gmail.com', password: '123123' })
    await user.save()
    TOKEN = generateToken(user.toJSON())
    TEST_USER = user

    done()
  })

  describe('Post testing', () => {
    it('should return 201 when creating a translation', async (done) => {
      const translation = TranslationBuilder.randomTranslation()
      const { statusCode } = await request
        .post('/translation')
        .send(translation)
        .set('Authorization', `Bearer ${TOKEN}`)

      expect(statusCode).toBe(201)

      done()
    })

    it('should return 400 when creating a translation with same value to languages', async (done) => {
      const translation = TranslationBuilder.randomTranslation({ fromLang: Languages.Ptbr, toLang: Languages.Ptbr })
      const { statusCode, body } = await request
        .post('/translation')
        .send(translation)
        .set('Authorization', `Bearer ${TOKEN}`)

      expect(statusCode).toBe(400)
      expect(body).toHaveProperty('field')
      expect(body).toHaveProperty('error')

      done()
    })

    it('should return 400 when creating a translation without originalText', async (done) => {
      const { originalText, ...restTranslation } = TranslationBuilder.randomTranslation({ fromLang: Languages.Ptbr, toLang: Languages.Ptbr })
      const { statusCode, body } = await request
        .post('/translation')
        .send(restTranslation)
        .set('Authorization', `Bearer ${TOKEN}`)

      expect(statusCode).toBe(400)
      expect(body).toHaveProperty('field')
      expect(body).toHaveProperty('error')

      done()
    })

    it('should return 400 when creating a translation without name', async (done) => {
      const { name, ...restTranslation } = TranslationBuilder.randomTranslation({ fromLang: Languages.Ptbr, toLang: Languages.Ptbr })
      const { statusCode, body } = await request
        .post('/translation')
        .send(restTranslation)
        .set('Authorization', `Bearer ${TOKEN}`)

      expect(statusCode).toBe(400)
      expect(body).toHaveProperty('field')
      expect(body).toHaveProperty('error')

      done()
    })
  })

  describe('Patch update testing', () => {
    it('should return 200 when updating', async (done) => {
      const translation = await new Translation(TranslationBuilder.randomTranslation({ user: TEST_USER._id }))
      await translation.save()

      const NEW_NAME = 'New Name'
      translation.name = NEW_NAME

      const { statusCode, body } = await request
        .patch(`/translation/${translation._id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(translation)

      expect(statusCode).toBe(200)
      expect(body).toHaveProperty('name', NEW_NAME)

      done()
    })
  })

  it('should return 200 when getting a specific translation', async (done) => {
    const translation = await new Translation(TranslationBuilder.randomTranslation({ user: TEST_USER._id }))
    await translation.save()

    const { statusCode, body } = await request
      .get(`/translation/${translation._id}`)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(statusCode).toBe(200)

    expect(body).toHaveProperty('_id', translation._id.toString())
    expect(body).toHaveProperty('fromLangLabel')

    done()
  })

  it('should return 200 when deleting a specific translation', async (done) => {
    const translation = await new Translation(TranslationBuilder.randomTranslation({ user: TEST_USER._id }))
    await translation.save()

    const { statusCode } = await request
      .delete(`/translation/${translation._id}`)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(statusCode).toBe(200)
    await expectToExistOnDb(translation, 'Translation')

    done()
  })

  afterAll((done) => {
    mongoose.connection.db.dropDatabase()

    done()
  })
})
