const express = require("express");
const disasterRouter = express.Router();
const disasterController = require("../controller/disasterController");
const authenticate = require("../middleware/jwt");

/**
 * @swagger
 * tags:
 *   name: Disasters
 *   description: Endpoints for managing disaster reports
 */

/**
 * @swagger
 * /disaster:
 *   post:
 *     summary: Report a new disaster
 *     description: Allows an authenticated NGO or admin to report a new disaster.
 *     tags: [Disasters]
 *     security:
 *       - bearerAuth: [] # Requires JWT token with "ngo" or "admin" role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - location
 *               - severity
 *               - reportedBy
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hurricane Alpha"
 *               type:
 *                 type: string
 *                 example: "Hurricane"
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Miami"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               severity:
 *                 type: string
 *                 example: "High"
 *               reportedBy:
 *                 type: string
 *                 example: "60d5f4832f8fb814b576e4b6"
 *     responses:
 *       200:
 *         description: Disaster reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 name:
 *                   type: string
 *                   example: "Hurricane Alpha"
 *                 type:
 *                   type: string
 *                   example: "Hurricane"
 *                 status:
 *                   type: string
 *                   example: "Active"
 *       401:
 *         description: Unauthorized (not an NGO or admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized: NGO or admin access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to report disaster"
 */
disasterRouter.post("/", authenticate(["ngo", "admin"]), disasterController.reportDisaster);

/**
 * @swagger
 * /disaster:
 *   get:
 *     summary: List all disasters
 *     description: Retrieves a list of all reported disasters with reporter details.
 *     tags: [Disasters]
 *     responses:
 *       200:
 *         description: Successfully retrieved disasters
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
 *                   name:
 *                     type: string
 *                     example: "Hurricane Alpha"
 *                   type:
 *                     type: string
 *                     example: "Hurricane"
 *                   reportedBy:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f4832f8fb814b576e4b6"
 *                       email:
 *                         type: string
 *                         example: "ngo@example.com"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to list disasters"
 */
disasterRouter.get("/", disasterController.listAllDisasters);

/**
 * @swagger
 * /disaster/{disasterId}:
 *   get:
 *     summary: Get a specific disaster
 *     description: Retrieves details of a specific disaster by ID, including reporter info.
 *     tags: [Disasters]
 *     parameters:
 *       - in: path
 *         name: disasterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the disaster to retrieve
 *         example: "60d5f4832f8fb814b576e4b7"
 *     responses:
 *       200:
 *         description: Successfully retrieved disaster
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4832f8fb814b576e4b7"
 *                 name:
 *                   type: string
 *                   example: "Hurricane Alpha"
 *                 type:
 *                   type: string
 *                   example: "Hurricane"
 *                 reportedBy:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f4832f8fb814b576e4b6"
 *                     email:
 *                       type: string
 *                       example: "ngo@example.com"
 *       404:
 *         description: Disaster not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Disaster not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get disaster"
 */
disasterRouter.get("/:disasterId", disasterController.getDisaster);

/**
 * @swagger
 * /disaster/{disasterId}/proposals:
 *   get:
 *     summary: Get proposals for a disaster
 *     description: Retrieves all funding proposals linked to a specific disaster, including NGO details.
 *     tags: [Disasters]
 *     parameters:
 *       - in: path
 *         name: disasterId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the disaster to fetch proposals for
 *         example: "60d5f4832f8fb814b576e4b7"
 *     responses:
 *       200:
 *         description: Successfully retrieved proposals
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
 *                   ngo:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5f4832f8fb814b576e4b6"
 *                       email:
 *                         type: string
 *                         example: "ngo@example.com"
 *                   title:
 *                     type: string
 *                     example: "Flood Relief Fund"
 *                   requestedAmount:
 *                     type: number
 *                     example: 10000
 *       404:
 *         description: Disaster not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Disaster not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve proposals"
 */
disasterRouter.get("/:disasterId/proposals", disasterController.getProposalsByDisaster);

module.exports = disasterRouter;