const express = require("express");
const donorController = require("../controller/donorController")
const authenticate  = require("../middleware/jwt")

const donorRouter = express.Router();

donorRouter.get("/donations", authenticate(["donor"]), donorController.getDonorDonations);


module.exports = donorRouter;
