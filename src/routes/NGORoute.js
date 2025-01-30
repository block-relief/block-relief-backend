const express = require("express");
const { 
  registerNGO, 
  submitProposal, 
  getAllNGOs, 
  verifyNGO, 
  getNGOById 
} = require("../controller/NGOController");


// Middleware for authorization (optional, if needed for some routes)
// const { isAdmin, isNGO } = require("../middleware/authMiddleware");

const ngoRouter = express.Router();

/**
 * @desc Register a new NGO
 * @route POST /api/ngos/register
 * @access Public
 */
ngoRouter.post("/register", registerNGO);

/**
 * @desc Submit a funding proposal
 * @route POST /api/ngos/:ngoId/proposals
 * @access NGO only
 */
ngoRouter.post("/:ngoId/proposals", submitProposal);

/**
 * @desc Get all NGOs
 * @route GET /api/ngos
 * @access Public
 */
ngoRouter.get("/", getAllNGOs);

/**
 * @desc Verify an NGO
 * @route PUT /api/ngos/:ngoId/verify
 * @access Admin only
 */
ngoRouter.put("/:ngoId/verify", verifyNGO);

/**
 * @desc Get a specific NGO
 * @route GET /api/ngos/:ngoId
 * @access Public
 */
ngoRouter.get("/:ngoId", getNGOById);

module.exports = ngoRouter;
