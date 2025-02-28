const express = require('express')
const bodyParser = require('body-parser')
const database  = require('./src/utils/db')
const dotenv = require('dotenv')
const ngoRouter = require('./src/routes/NGORoute')
const authRouter = require('./src/routes/authRoutes')
const userRouter = require('./src/routes/userRoutes')
const { config } = require('./src/config/config')

dotenv.config()

const app = express()

PORT = config.PORT || 5000

app.use(bodyParser.json({limit: '50mb'}))

app.use('/ngo', ngoRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)

database()

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

