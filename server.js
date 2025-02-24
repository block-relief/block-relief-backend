const express = require('express')
const bodyParser = require('body-parser')
const database  = require('./src/config/db')
const dotenv = require('dotenv')
const ngoRouter = require('./src/routes/NGORoute')

dotenv.config()

const app = express()

PORT = process.env.PORT || 5000

app.use(bodyParser.json({limit: '50mb'}))

app.use('/ngo', ngoRouter)

database()

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

