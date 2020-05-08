require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./controllers/authController')(app)
require('./controllers/translationController')(app)

app.listen(3000, () => {
    console.log('Started');    
})