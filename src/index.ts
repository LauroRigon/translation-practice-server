import server from './app/server'

server.express.listen(3333, () => {
  console.log('Started')
})
