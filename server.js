const express = require('express')
const bodyParser = require('body-parser')
const database  = require('./src/utils/db')
const dotenv = require('dotenv')
const ngoRouter = require('./src/routes/NGORoute')
const authRouter = require('./src/routes/authRoutes')
const userRouter = require('./src/routes/userRoutes')
const transactionRouter = require('./src/routes/transactionRoutes')
const proposalRouter = require('./src/routes/proposalRoutes')
const disasterRouter = require('./src/routes/disaster')
const { config } = require('./src/config/config')

dotenv.config()

const app = express()

PORT = config.PORT || 5000

app.use(bodyParser.json({limit: '50mb'}))

app.use('/ngo', ngoRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/transaction', transactionRouter)
app.use('/proposal', proposalRouter)
app.use('/disaster', disasterRouter)

database()

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})

