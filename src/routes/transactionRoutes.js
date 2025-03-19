const express = require("express");
const transactionController = require("../controller/transactionController");
const authenticate = require("../middleware/jwt");

const transactionRouter = express.Router();

transactionRouter.post("/donate-to-proposal", transactionController.createDonation);
transactionRouter.post("/donate-to-disaster", transactionController.donateToDisaster)
transactionRouter.post("/release-funds", authenticate(['admin']), transactionController.releaseFunds);
transactionRouter.get("/", authenticate(['admin', 'donor']), transactionController.listTransactions);
transactionRouter.post("/fiat/proposal", authenticate(["donor", "admin"]), transactionController.donateToProposalFiat);
transactionRouter.post("/fiat/disaster", authenticate(["donor", "admin"]), transactionController.donateToDisasterFiat);
transactionRouter.post("/verify", authenticate(["donor", "admin"]), transactionController.verifyPayment); // Or webhook


module.exports = transactionRouter;