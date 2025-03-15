const express = require('express');
const ngoRouter = express.Router();
const { submitNGODocsController, getNGODocsController, listVerifiedNGOsController } = require('../controller/NGOController');
const { upload } = require('../middleware/multerConfig');

/**
 * @swagger
 * tags:
 *   name: NGOs
 *   description: Endpoints for managing NGO data and documents
 */

/**
 * @swagger
 * /ngo/submit-docs:
 *   post:
 *     summary: Submit NGO verification documents
 *     description: Allows an NGO to submit verification documents (registration, tax certificate, proof of operation) for review.
 *     tags: [NGOs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               registration:
 *                 type: string
 *                 format: binary
 *                 description: NGO registration document
 *               tax_cert:
 *                 type: string
 *                 format: binary
 *                 description: Tax certificate document
 *               proof_of_op:
 *                 type: string
 *                 format: binary
 *                 description: Proof of operation document
 *             required:
 *               - registration
 *               - tax_cert
 *               - proof_of_op
 *     responses:
 *       200:
 *         description: Documents submitted successfully
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
 *                   example: "Documents submitted successfully"
 *       400:
 *         description: Bad request (e.g., missing files)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All documents are required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to submit documents"
 */
ngoRouter.post('/submit-docs', upload.fields([
    { name: 'registration', maxCount: 1 },
    { name: 'tax_cert', maxCount: 1 },
    { name: 'proof_of_op', maxCount: 1 }
]), submitNGODocsController);

/**
 * @swagger
 * /ngo/docs/{userHash}:
 *   get:
 *     summary: Get NGO documents
 *     description: Retrieves the submitted documents for an NGO identified by its userHash.
 *     tags: [NGOs]
 *     parameters:
 *       - in: path
 *         name: userHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique hash or ID of the NGO user
 *         example: "some-user-hash"
 *     responses:
 *       200:
 *         description: Successfully retrieved NGO documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 registration:
 *                   type: string
 *                   example: "https://cloudinary.com/path/to/registration.pdf"
 *                 tax_cert:
 *                   type: string
 *                   example: "https://cloudinary.com/path/to/tax_cert.pdf"
 *                 proof_of_op:
 *                   type: string
 *                   example: "https://cloudinary.com/path/to/proof_of_op.pdf"
 *       404:
 *         description: NGO or documents not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Documents not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve documents"
 */
ngoRouter.get('/docs/:userHash', getNGODocsController);

/**
 * @swagger
 * /ngo/verified:
 *   get:
 *     summary: List verified NGOs
 *     description: Retrieves a list of all verified NGOs from the database.
 *     tags: [NGOs]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of verified NGOs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4832f8fb814b576e4b6"
 *                   email:
 *                     type: string
 *                     example: "ngo@example.com"
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["ngo"]
 *                   verificationStatus:
 *                     type: string
 *                     example: "verified"
 *                   profile:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Helping Hands NGO"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to list verified NGOs"
 */
ngoRouter.get('/verified', listVerifiedNGOsController);

module.exports = ngoRouter;