import { config } from 'dotenv'
import supertest from 'supertest'
import server from '../app/server'
import mongoose from 'mongoose'

const request = supertest(server.express)
config()

const TEST_USER = {
  email: 'laurorigon@gmail.com',
  password: '123456'
}

describe('Test Authentication', async () => {
  it('should return 201 and register the user to db', async (done) => {
    const { statusCode, body } = await request
      .post('/auth/register')
      .send({ email: TEST_USER.email, password: TEST_USER.password })

    expect(body).toMatchObject({
      user: {
        email: TEST_USER.email
      }
    })
    expect(statusCode).toBe(201)

    done()
  })

  it('should return 200 and a token when login in', async (done) => {
    const { statusCode, body } = await request
      .post('/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password })

    expect(body).toMatchObject({
      user: {
        email: TEST_USER.email
      }
    })
    expect(body).toHaveProperty('token')
    expect(statusCode).toBe(200)

    done()
  })

  it('should return 404 when user email do not exists on db', async (done) => {
    const { statusCode } = await request
      .post('/auth/login')
      .send({ email: 'user@gmail.com', password: TEST_USER.password })

    expect(statusCode).toBe(404)

    done()
  })

  it('should return 401 when user password is wrong', async (done) => {
    const { statusCode } = await request
      .post('/auth/login')
      .send({ email: TEST_USER.email, password: 'wrongpass' })

    expect(statusCode).toBe(401)
    done()
  })

  afterAll((done) => {
    mongoose.connection.db.dropDatabase()

    done()
  })
})
