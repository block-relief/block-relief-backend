const express = require("express");
const donorController = require("../controller/donorController");
const authenticate = require("../middleware/jwt");

const donorRouter = express.Router();

/**
 * @swagger
 * /donor/donations:
 *   get:
 *     summary: Get donation details for the authenticated donor
 *     description: Fetches the donation history and total donations for the authenticated donor.
 *     tags:
 *       - Donor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved donor donation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 donorName:
 *                   type: string
 *                   description: Name of the donor
 *                   example: "John Doe"
 *                 totalDonations:
 *                   type: number
 *                   description: Total amount donated by the donor
 *                   example: 1500
 *                 donations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       amountDonated:
 *                         type: number
 *                         description: Amount donated in this transaction
 *                         example: 500
 *                       proposalDonatedTo:
 *                         type: string
 *                         description: Title of the proposal the donation was made to
 *                         example: "Food for 1000 Families"
 *                       disasterDonatedTo:
 *                         type: string
 *                         description: Name of the disaster the donation was made for
 *                         example: "Hurricane Relief"
 *                       transactionDate:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the transaction
 *                         example: "2023-10-01T12:34:56.789Z"
 *                       currency:
 *                         type: string
 *                         description: Currency of the donation
 *                         example: "USD"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch donor donation details"
 */
donorRouter.get("/donations", authenticate(["donor"]), donorController.getDonorDonations);

module.exports = donorRouter;