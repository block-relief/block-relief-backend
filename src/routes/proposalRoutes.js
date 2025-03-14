const express = require("express");
const proposalRouter = express.Router();
const proposalController = require("../controller/proposalController");
const authenticate = require("../middleware/jwt");

proposalRouter.post("/",  authenticate(["ngo"]), proposalController.createProposal);
proposalRouter.put("/:proposalId/approve", authenticate(['admin']), proposalController.approveProposal);
proposalRouter.put("/:proposalId/reject", authenticate(["admin"]), proposalController.rejectProposal);
proposalRouter.get("/", authenticate(['admin']), proposalController.listAllProposals);
proposalRouter.get("/:proposalId", proposalController.getProposal);

module.exports = proposalRouter;
