import server from './app/server'

const { APP_PORT } = process.env

server.express.listen(APP_PORT, () => {
  console.log(`Started on port ${APP_PORT}`)
})
