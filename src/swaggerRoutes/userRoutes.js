const express = require('express');
const userRouter = express.Router();
const { verifyUserController } = require('../controller/userController');
const authenticate = require('../middleware/jwt')

/**
 * @swagger
 * /user/verify:
 *   post:
 *     summary: Verify a user (Admin only)
 *     description: Allows an admin to verify a user by providing an adminHash, userHash, and role. The adminHash and userHash are used for verification, and the role specifies the role to assign to the user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminHash
 *               - userHash
 *               - role
 *             properties:
 *               adminHash:
 *                 type: string
 *                 description: The admin's verification hash.
 *                 example: "admin12345"
 *               userHash:
 *                 type: string
 *                 description: The user's verification hash.
 *                 example: "user67890"
 *               role:
 *                 type: string
 *                 description: The role to assign to the user (e.g., "donor", "ngo").
 *                 example: "donor"
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User verified successfully"
 *       400:
 *         description: Bad request - Invalid input or verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input or verification failed"
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
 *       403:
 *         description: Forbidden - Admin access required
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
 *                   example: "Internal server error"
 */
userRouter.post(
    "/verify",
    authenticate(["admin"]),
    verifyUserController
  );

module.exports = userRouter;