import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import routes from './routes'

import { config } from 'dotenv'
config()

class Server {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(cors())
  }

  private database (): void {
    const database = process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL

    mongoose.connect(`mongodb://${process.env.APP_HOST}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.Promise = global.Promise
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default new Server()
