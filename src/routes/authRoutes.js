const express = require("express");
const { loginUser, registerUserController, getCurrentUser } = require('../controller/authController')
authRouter = express.Router()

authRouter.post("/login", loginUser);
authRouter.post('/register', registerUserController)
authRouter.get('/me', getCurrentUser);

module.exports = authRouter
