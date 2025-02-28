const express = require("express");
const { donorSignUp } = require("../controller/authController");

const donorRouter = express.Router();

donorRouter.post("/donor/signup", donorSignUp);

module.exports = donorRouter;
