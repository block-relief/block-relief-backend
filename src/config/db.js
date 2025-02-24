const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

MONGO_URL = process.env.MONGOURL

const database = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Mongodb connected successfully')
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = database