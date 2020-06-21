// import server from './app/server';
//
// require('dotenv').config();
//
// require('./app/controllers/index.js')(server);
//
// server.listen(3000, () => {
//     console.log('Started');
// });

import express from 'express'

console.log(Translation)
const app = express()

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' })
})

app.listen(3333)
