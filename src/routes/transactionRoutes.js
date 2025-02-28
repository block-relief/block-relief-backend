const express = require("express");
const transactionController = require("../controllers/transactionController");
const authenticate = require("../middleware/authenticate"); // Optional: Add authentication middleware

const router = express.Router();

// Donate to a Proposal
router.post("/donate", authenticate, transactionController.donateToProposal);

// Release Funds for a Milestone
router.post("/release-funds", authenticate, transactionController.releaseFunds);

// List All Transactions
router.get("/", authenticate, transactionController.listTransactions);

module.exports = router;