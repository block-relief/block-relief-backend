const express = require("express");
const { loginUser, registerUserController, getCurrentUser } = require('../controller/authController');
const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication and management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the application
 *     description: Authenticates a user with email and password, returning a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successfully logged in, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
authRouter.post("/login", loginUser);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with email, password, role, and optional profile/role-specific data. Returns user details and a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: ["donor", "ngo", "beneficiary", "admin"]
 *                 example: "ngo"
 *               profileData:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *               roleSpecificData:
 *                 type: object
 *                 description: Role-specific fields (varies by role)
 *                 oneOf:
 *                   - type: object
 *                     properties:
 *                       paymentMethods:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["credit_card", "paypal"]
 *                     description: For "donor" role
 *                   - type: object
 *                     properties:
 *                       registrationNumber:
 *                         type: string
 *                         example: "NGO12345"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       address:
 *                         type: string
 *                         example: "123 Charity Lane"
 *                       country:
 *                         type: string
 *                         example: "USA"
 *                       contactPerson:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Smith"
 *                           email:
 *                             type: string
 *                             example: "john@ngo.org"
 *                     description: For "ngo" role
 *                   - type: object
 *                     properties:
 *                       aidRequestDetails:
 *                         type: object
 *                         properties:
 *                           description:
 *                             type: string
 *                             example: "Need food supplies"
 *                     description: For "beneficiary" role
 *                   - type: object
 *                     description: For "admin" role (no additional fields)
 *     responses:
 *       200:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d5f4832f8fb814b576e4b6"
 *                     email:
 *                       type: string
 *                       example: "newuser@example.com"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["ngo"]
 *                     verificationStatus:
 *                       type: string
 *                       example: "pending"
 *                     profile:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Jane Doe"
 *                     linkedProfile:
 *                       type: string
 *                       example: "60d5f4832f8fb814b576e4b7"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 blockchainHash:
 *                   type: string
 *                   example: "some-hash-value"
 *       400:
 *         description: Bad request (e.g., email already registered)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
authRouter.post('/register', registerUserController);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Retrieves details of the currently authenticated user based on JWT token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: [] # Indicates JWT token is required
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 role:
 *                   type: string
 *                   example: "ngo"
 *               nullable: true
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 *                   example: "Server error"
 */
authRouter.get('/me', getCurrentUser);

module.exports = authRouter;