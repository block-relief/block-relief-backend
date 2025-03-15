const express = require('express')
const bodyParser = require('body-parser')
const database  = require('./src/utils/db')
const dotenv = require('dotenv')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swaggerConfig')

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

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(bodyParser.json({limit: '50mb'}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

app.get("/", (req, res, next) => {
    res.send(
        "Welcome to Block-Relief Backend. Go to <a href='/docs/'>/docs</a> for the api documentation"
    )
})
