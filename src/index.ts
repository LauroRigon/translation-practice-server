import server from './app/server'

server.express.listen(process.env.APP_PORT, () => {
  console.log('Started')
})
