const express = require("express");
const transactionController = require("../controller/transactionController");
const authenticate = require("../middleware/jwt");

const transactionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for managing donations and fund releases
 */

// /**
//  * @swagger
//  * /transaction/donate-to-proposal:
//  *   post:
//  *     summary: Donate to a proposal
//  *     description: Allows a donor to make a donation to a specific proposal.
//  *     tags: [Transactions]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - donorId
//  *               - proposalId
//  *               - amount
//  *             properties:
//  *               donorId:
//  *                 type: string
//  *                 example: "60d5f4832f8fb814b576e4b6"
//  *               proposalId:
//  *                 type: string
//  *                 example: "60d5f4832f8fb814b576e4b7"
//  *               amount:
//  *                 type: number
//  *                 example: 500
//  *     responses:
//  *       200:
//  *         description: Donation created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 transaction:
//  *                   type: object
//  *                   properties:
//  *                     _id:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4b8"
//  *                     donor:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4b6"
//  *                     proposal:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4b7"
//  *                     amount:
//  *                       type: number
//  *                       example: 500
//  *                     status:
//  *                       type: string
//  *                       example: "Completed"
//  *       400:
//  *         description: Bad request (e.g., donor not found)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Donor not found"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Donation failed: Server error"
//  */
// // transactionRouter.post("/donate-to-proposal", transactionController.createDonation);

// /**
//  * @swagger
//  * /transaction/donate-to-disaster:
//  *   post:
//  *     summary: Donate to a disaster
//  *     description: Allows a donor to make a donation to a specific disaster.
//  *     tags: [Transactions]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - donorId
//  *               - disasterId
//  *               - amount
//  *             properties:
//  *               donorId:
//  *                 type: string
//  *                 example: "60d5f4832f8fb814b576e4b6"
//  *               disasterId:
//  *                 type: string
//  *                 example: "60d5f4832f8fb814b576e4b9"
//  *               amount:
//  *                 type: number
//  *                 example: 1000
//  *     responses:
//  *       200:
//  *         description: Disaster donation created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 transaction:
//  *                   type: object
//  *                   properties:
//  *                     _id:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4ba"
//  *                     donor:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4b6"
//  *                     disaster:
//  *                       type: string
//  *                       example: "60d5f4832f8fb814b576e4b9"
//  *                     amount:
//  *                       type: number
//  *                       example: 1000
//  *                     status:
//  *                       type: string
//  *                       example: "Completed"
//  *       400:
//  *         description: Bad request (e.g., donor not found)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Donor not found"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Disaster donation failed: Server error"
//  */
// // transactionRouter.post("/donate-to-disaster", transactionController.donateToDisaster);

/**
 * @swagger
 * /transaction/release-funds:
 *   post:
 *     summary: Release funds for a proposal milestone
 *     description: Allows an authenticated admin to release funds for a specific milestone in a proposal.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "admin" role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposalId
 *               - milestoneId
 *             properties:
 *               proposalId:
 *                 type: string
 *                 example: "60d5f4832f8fb814b576e4b7"
 *               milestoneId:
 *                 type: string
 *                 example: "milestone-001"
 *     responses:
 *       200:
 *         description: Funds released successfully
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
 *                 milestones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       milestoneId:
 *                         type: string
 *                         example: "milestone-001"
 *                       isReleased:
 *                         type: boolean
 *                         example: true
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
 *         description: Proposal or milestone not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Milestone not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to release funds"
 */
transactionRouter.post("/release-funds", authenticate(['admin']), transactionController.releaseFunds);

/**
 * @swagger
 * /transaction:
 *   get:
 *     summary: List all transactions
 *     description: Allows an authenticated admin or donor to retrieve a list of all transactions with donor details.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "admin" or "donor" role
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4832f8fb814b576e4b8"
 *                   donor:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f4832f8fb814b576e4b6"
 *                       email:
 *                         type: string
 *                         example: "donor@example.com"
 *                   amount:
 *                     type: number
 *                     example: 500
 *                   status:
 *                     type: string
 *                     example: "Completed"
 *       401:
 *         description: Unauthorized (not an admin or donor)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: Admin or donor access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to list transactions"
 */
transactionRouter.get("/", authenticate(['admin', 'donor']), transactionController.listTransactions);

/**
 * @swagger
 * /transaction/fiat/proposal:
 *   post:
 *     summary: Donate to a proposal using fiat currency
 *     description: Initiates a fiat donation to a specific proposal. The payment is processed via Paystack. The `donorId` is automatically retrieved from the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposalId
 *               - amount
 *               - email
 *             properties:
 *               proposalId:
 *                 type: string
 *                 description: The ID of the proposal being donated to.
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *               amount:
 *                 type: number
 *                 description: The amount to donate.
 *                 example: 1000
 *               email:
 *                 type: string
 *                 description: The email address of the donor for payment processing.
 *                 example: "donor@example.com"
 *               currency:
 *                 type: string
 *                 description: The currency of the donation (default is GHS).
 *                 example: "GHS"
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d4"
 *                     donor:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     proposal:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     currency:
 *                       type: string
 *                       example: "GHS"
 *                     reference:
 *                       type: string
 *                       example: "REF123456789"
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     paymentStatus:
 *                       type: string
 *                       example: "Initiated"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56.789Z"
 *                 response:
 *                   type: object
 *                   description: Response from Paystack.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
transactionRouter.post(
    "/fiat/proposal",
    authenticate(["donor", "admin"]),
    transactionController.donateToProposalFiat
  );


/**
 * @swagger
 * /transaction/fiat/disaster:
 *   post:
 *     summary: Donate to a disaster using fiat currency
 *     description: Initiates a fiat donation to a specific disaster. The payment is processed via Paystack. The `donorId` is automatically retrieved from the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - disasterId
 *               - amount
 *               - email
 *             properties:
 *               disasterId:
 *                 type: string
 *                 description: The ID of the disaster being donated to.
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *               amount:
 *                 type: number
 *                 description: The amount to donate.
 *                 example: 1000
 *               email:
 *                 type: string
 *                 description: The email address of the donor for payment processing.
 *                 example: "donor@example.com"
 *               currency:
 *                 type: string
 *                 description: The currency of the donation (default is GHS).
 *                 example: "GHS"
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d4"
 *                     donor:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     disaster:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                     amount:
 *                       type: number
 *                       example: 1000
 *                     currency:
 *                       type: string
 *                       example: "GHS"
 *                     reference:
 *                       type: string
 *                       example: "REF123456789"
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *                     paymentStatus:
 *                       type: string
 *                       example: "Initiated"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T12:34:56.789Z"
 *                 response:
 *                   type: object
 *                   description: Response from Paystack.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */
transactionRouter.post(
    "/fiat/disaster",
    authenticate(["donor", "admin"]),
    transactionController.donateToDisasterFiat
  );


/**
 * @swagger
 * /transaction/verify:
 *   post:
 *     summary: Verify a payment
 *     description: Verifies the status of a payment using the transaction reference. Updates the transaction and associated records (donor, proposal/disaster) if the payment is successful.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *             properties:
 *               reference:
 *                 type: string
 *                 description: The transaction reference from Paystack.
 *                 example: "REF123456789"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d4"
 *                 donor:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 proposal:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 disaster:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                 amount:
 *                   type: number
 *                   example: 1000
 *                 currency:
 *                   type: string
 *                   example: "GHS"
 *                 reference:
 *                   type: string
 *                   example: "REF123456789"
 *                 status:
 *                   type: string
 *                   example: "Completed"
 *                 paymentStatus:
 *                   type: string
 *                   example: "Completed"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:34:56.789Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:34:56.789Z"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
transactionRouter.post(
    "/verify",
    authenticate(["donor", "admin"]),
    transactionController.verifyPayment
  );


module.exports = transactionRouter;