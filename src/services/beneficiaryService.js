const User = require("../models/User");
const Beneficiary = require("../models/Beneficiary");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken_");
const { mapRoleToBlockchain } = require("../utils/mapRoles")
const blockchainService = require('./blochain')


async function registerBeneficiary(walletAddress, email, password, aidRequestDetails) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ walletAddress, email, password: hashedPassword, roles: ["beneficiary"] });
    const savedUser = await user.save();

    const beneficiary = new Beneficiary({ userId: savedUser._id, aidRequestDetails });
    const savedBeneficiary = await beneficiary.save();

    savedUser.linkedProfile = savedBeneficiary._id;
    await savedUser.save();

    // Register the user on the blockchain
    const userHash = savedUser._id.toString()
    const blockchainRole = mapRoleToBlockchain("beneficiary")
    const blockchainResult = await blockchainService.addUser(userHash, blockchainRole)

    if (!blockchainResult) {
        // Roleback MongoDB changes if the blockchain fails
        await User.deleteOne({ _id: savedUser._id });
        await Beneficiary.deleteOne({ _id: savedBeneficiary._id })
        throw new Error("Failed to register Beneficiary on the blockchain.")
    }

    const token = generateToken({ userId: savedUser._id, roles: savedUser.roles });
    return { token, user: savedUser };
}

async function listVerifiedBeneficiaries() {
    try {
      const beneficiaries = await blockchainService.listVerifiedBeneficiaries();
      return beneficiaries; // Array of userHashes
    } catch (error) {
      throw new Error(`Failed to list verified beneficiaries: ${error.message}`);
    }
  }

module.exports = { registerBeneficiary, listVerifiedBeneficiaries };
