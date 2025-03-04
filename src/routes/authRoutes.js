const express = require("express");
const { loginUser, registerUserController } = require('../controller/authController')
authRouter = express.Router()

authRouter.post("/login", loginUser);
authRouter.post('/register', registerUserController)

module.exports = authRouter
