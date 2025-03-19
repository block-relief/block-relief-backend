const express = require("express");
const proposalRouter = express.Router();
const proposalController = require("../controller/proposalController");
const authenticate = require("../middleware/jwt");

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Endpoints for managing funding proposals
 */

/**
 * @swagger
 * /proposal:
 *   post:
 *     summary: Create a new funding proposal
 *     description: Allows an authenticated NGO to create a funding proposal with details like title, description, and milestones.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "ngo" role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - requestedAmount
 *               - disasterId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Flood Relief Fund"
 *               description:
 *                 type: string
 *                 example: "Funding for flood victims in Region X"
 *               requestedAmount:
 *                 type: number
 *                 example: 10000
 *               disasterId:
 *                 type: string
 *                 example: "60d5f4832f8fb814b576e4b6"
 *               milestones:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "Distribute food supplies"
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                 example: [{ "description": "Distribute food supplies", "amount": 5000 }]
 *               breakdown:
 *                 type: object
 *                 example: { "food": 6000, "transport": 4000 }
 *               fundingSource:
 *                 type: string
 *                 example: "Community Donations"
 *     responses:
 *       200:
 *         description: Proposal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 ngo:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b6"
 *                 title:
 *                   type: string
 *                   example: "Flood Relief Fund"
 *                 description:
 *                   type: string
 *                   example: "Funding for flood victims in Region X"
 *                 requestedAmount:
 *                   type: number
 *                   example: 10000
 *                 disaster:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b6"
 *                 milestones:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: [{ "description": "Distribute food supplies", "amount": 5000 }]
 *                 breakdown:
 *                   type: object
 *                   example: { "food": 6000, "transport": 4000 }
 *                 fundingSource:
 *                   type: string
 *                   example: "Community Donations"
 *                 status:
 *                   type: string
 *                   example: "Pending"
 *                 lastModifiedBy:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b6"
 *                 modifierModel:
 *                   type: string
 *                   example: "NGO"
 *       401:
 *         description: Unauthorized (not an NGO)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: NGO access required"
 *       400:
 *         description: Bad request (e.g., NGO not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "NGO not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create proposal"
 */
proposalRouter.post("/", authenticate(["ngo"]), proposalController.createProposal);

/**
 * @swagger
 * /proposal/{proposalId}/approve:
 *   put:
 *     summary: Approve a funding proposal
 *     description: Allows an authenticated admin to approve a funding proposal.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "admin" role
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the proposal to approve
 *         example: "60d5f4832f8fb814b576e4b7"
 *     responses:
 *       200:
 *         description: Proposal approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 status:
 *                   type: string
 *                   example: "Approved"
 *                 lastModifiedBy:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b8"
 *                 modifierModel:
 *                   type: string
 *                   example: "Admin"
 *       401:
 *         description: Unauthorized (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Admin access required"
 *       404:
 *         description: Proposal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Proposal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to approve proposal"
 */
proposalRouter.put("/:proposalId/approve", authenticate(['admin']), proposalController.approveProposal);

/**
 * @swagger
 * /proposal/{proposalId}/reject:
 *   put:
 *     summary: Reject a funding proposal
 *     description: Allows an authenticated admin to reject a funding proposal.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "admin" role
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the proposal to reject
 *         example: "60d5f4832f8fb814b576e4b7"
 *     responses:
 *       200:
 *         description: Proposal rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 status:
 *                   type: string
 *                   example: "Rejected"
 *                 lastModifiedBy:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b8"
 *                 modifierModel:
 *                   type: string
 *                   example: "admin"
 *       401:
 *         description: Unauthorized (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Admin access required"
 *       404:
 *         description: Proposal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Proposal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to reject proposal"
 */
proposalRouter.put("/:proposalId/reject", authenticate(["admin"]), proposalController.rejectProposal);

/**
 * @swagger
 * /proposal:
 *   get:
 *     summary: List all funding proposals
 *     description: Allows an authenticated admin to retrieve a list of all funding proposals with populated NGO and disaster data.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "admin" role
 *     responses:
 *       200:
 *         description: Successfully retrieved list of proposals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4832f8fb814b576e4b7"
 *                   ngo:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f4832f8fb814b576e4b6"
 *                       email:
 *                         type: string
 *                         example: "ngo@example.com"
 *                       profile:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Helping Hands NGO"
 *                   title:
 *                     type: string
 *                     example: "Flood Relief Fund"
 *                   description:
 *                     type: string
 *                     example: "Funding for flood victims in Region X"
 *                   requestedAmount:
 *                     type: number
 *                     example: 10000
 *                   disaster:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f4832f8fb814b576e4b6"
 *                       title:
 *                         type: string
 *                         example: "Flood Disaster 2025"
 *                   milestones:
 *                     type: array
 *                     items:
 *                       type: object
 *                       example: { "description": "Distribute food supplies", "amount": 5000 }
 *                   breakdown:
 *                     type: object
 *                     example: { "food": 6000, "transport": 4000 }
 *                   fundingSource:
 *                     type: string
 *                     example: "Community Donations"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *       401:
 *         description: Unauthorized (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Admin access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to list all proposals"
 */
proposalRouter.get("/", authenticate(['admin']), proposalController.listAllProposals);

/**
 * @swagger
 * /proposal/{proposalId}:
 *   get:
 *     summary: Get a specific funding proposal
 *     description: Retrieves details of a specific funding proposal by ID, including populated NGO and disaster data.
 *     tags: [Proposals]
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the proposal to retrieve
 *         example: "60d5f4832f8fb814b576e4b7"
 *     responses:
 *       200:
 *         description: Successfully retrieved proposal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 ngo:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f4832f8fb814b576e4b6"
 *                     email:
 *                       type: string
 *                       example: "ngo@example.com"
 *                     profile:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Helping Hands NGO"
 *                 title:
 *                   type: string
 *                   example: "Flood Relief Fund"
 *                 description:
 *                   type: string
 *                   example: "Funding for flood victims in Region X"
 *                 requestedAmount:
 *                   type: number
 *                   example: 10000
 *                 disaster:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f4832f8fb814b576e4b6"
 *                     title:
 *                       type: string
 *                       example: "Flood Disaster 2025"
 *                 milestones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: { "description": "Distribute food supplies", "amount": 5000 }
 *                 breakdown:
 *                   type: object
 *                   example: { "food": 6000, "transport": 4000 }
 *                 fundingSource:
 *                   type: string
 *                   example: "Community Donations"
 *                 status:
 *                   type: string
 *                   example: "Pending"
 *       404:
 *         description: Proposal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Proposal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get proposal"
 */
proposalRouter.get("/:proposalId", proposalController.getProposal);

/**
 * @swagger
 * /proposal/total/{proposalId}:
 *   get:
 *     summary: Get total donations for a specific proposal
 *     description: Fetches the total contributions made to a specific proposal by its ID.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to fetch total donations for.
 *         example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     responses:
 *       200:
 *         description: Successfully retrieved total donations for the proposal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalContributions:
 *                   type: number
 *                   description: Total amount of contributions made to the proposal
 *                   example: 50000
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Proposal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Proposal not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch total donations for the proposal"
 */
proposalRouter.get(
    "/total/:proposalId",
    authenticate(["donor", "admin"]),
    proposalController.getTotalDonationsForProposal
  );

module.exports = proposalRouter;