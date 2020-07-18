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
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(cors())
  }

  private database (): void {
    const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME
    const { DB_HOST, DB_PORT } = process.env
    mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })

    mongoose.connection.on('error', () => console.error('error to connect to: ' + `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`))
    mongoose.connection.on('open', () => console.error('connected to: ' + `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`))
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default new Server()
