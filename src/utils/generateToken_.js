const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { config } = require('../config/config')

JWT_SECRET = config.JWT_SECRET
JWT_EXPIRATION = config.JWT_EXPIRATION
HASH_SALT = config.HASH_SALT

/**
 * Generates a JSON Web Token (JWT) for a given user.
 *
 * @param {Object} payload - The payload to encode in the token.
 * @param {string} payload.userId - The ID of the user.
 * @param {string[]} payload.roles - The roles of the user.
 *
 * @returns {string} The generated JWT token.
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}


function createSalt(email) {
    return crypto
        .createHash('sha256') 
        .update(email + HASH_SALT) 
        .digest('hex'); 
}


module.exports = {
    generateToken,
    createSalt,
}