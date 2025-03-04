const User = require("../models/User");
const blockchainService = require("./blockchain");

async function verifyUser(adminHash, userHash, role) {
  try {
    // Verify on blockchain
    const blockchainResult = await blockchainService.verifyUser(adminHash, userHash, role);
    if (!blockchainResult) {
      throw new Error("Failed to verify user on blockchain");
    }

    // Update MongoDB
    const user = await User.findOneAndUpdate(
      { blockchainHash: userHash },
      { verificationStatus: "verified" },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found in MongoDB");
    }

    return { success: true, user };
  } catch (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }
}

module.exports = { verifyUser };