const express = require("express");
const transactionController = require("../controller/transactionController");
const authenticate = require("../middleware/jwt");

const transactionRouter = express.Router();

transactionRouter.post("/donate-to-proposal", transactionController.createDonation);
transactionRouter.post("/donate-to-disaster", transactionController.donateToDisaster)
transactionRouter.post("/release-funds", authenticate(['admin']), transactionController.releaseFunds);
transactionRouter.get("/", authenticate(['admin', 'donor']), transactionController.listTransactions);

module.exports = transactionRouter;