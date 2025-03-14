const express = require("express");
const disasterRouter = express.Router();
const disasterController = require("../controller/disasterController");
const authenticate = require("../middleware/jwt");

disasterRouter.post("/", authenticate(["ngo", "admin"]), disasterController.reportDisaster);
disasterRouter.get("/", disasterController.listAllDisasters);
disasterRouter.get("/:disasterId", disasterController.getDisaster);
disasterRouter.get("/:disasterId/proposals", disasterController.getProposalsByDisaster)

module.exports = disasterRouter;