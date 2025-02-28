const express = require('express');
const userRouter = express.Router();
const { verifyUserController } = require('../controller/userController');
const authenticate = require('../middleware/jwt')

userRouter.post('/verify', authenticate(["admin"]), verifyUserController);

module.exports = userRouter;