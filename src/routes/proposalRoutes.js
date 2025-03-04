const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposalController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Create Proposal (Only NGOs)
router.post("/", authenticate, authorize(["ngo"]), proposalController.createProposal);

// Approve Proposal (Admin only)
router.put("/:proposalId/approve", authenticate, authorize(["admin"]), proposalController.approveProposal);

// Reject Proposal (Admin only)
router.put("/:proposalId/reject", authenticate, authorize(["admin"]), proposalController.rejectProposal);

// Get all proposals
router.get("/", authenticate, proposalController.listAllProposals);

// Get a specific proposal
router.get("/:proposalId", authenticate, proposalController.getProposal);

module.exports = router;
