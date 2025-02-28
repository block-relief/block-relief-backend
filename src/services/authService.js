const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken, createSalt } = require('../utils/generateToken_')
const NGO = require('../models/NGO')
const Donor = require("../models/Donor");
const Beneficiary = require("../models/Beneficiary");
const Admin = require("../models/Admin");
const blockchainService = require("../services/blockchain");
const { mapRoleToBlockchain } = require("../utils/mapRoles");


async function login(email, password) {
   const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials.");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials.");

    const token = generateToken({ userId: user._id, roles: user.roles })

    return { user, token };
}



async function registerUser({ email, password, role, profileData = {}, roleSpecificData = {} }) {
  // Check for existing user
  if (await User.findOne({ email })) {
    throw new Error("Email is already registered");
  }

  // Hash password and generate blockchainHash
  const hashedPassword = await bcrypt.hash(password, 10);
  const blockchainHash = createSalt(email)

  // Create base User
  const user = new User({
    email,
    password: hashedPassword,
    roles: [role],
    blockchainHash,
    verificationStatus: role === "donor" || role === "admin" ? "verified" : "pending", // Donors/admins auto-verified
    profile: { name: profileData.name || email.split('@')[0] } // Default name if not provided
  });
  const savedUser = await user.save();

  try {
    // Role-specific profile creation
    let profileModel, profileDataToSave;
    switch (role) {
      case "donor":
        profileModel = Donor;
        profileDataToSave = { userId: savedUser._id, paymentMethods: roleSpecificData.paymentMethods || [] };
        break;
      case "ngo":
        profileModel = NGO;
        profileDataToSave = {
          userId: savedUser._id,
          registrationNumber: roleSpecificData.registrationNumber,
          phone: roleSpecificData.phone,
          address: roleSpecificData.address,
          country: roleSpecificData.country,
          contactPerson: roleSpecificData.contactPerson || {}
        };
        break;
      case "beneficiary":
        profileModel = Beneficiary;
        profileDataToSave = { userId: savedUser._id, aidRequestDetails: roleSpecificData.aidRequestDetails || {} };
        break;
      case "admin":
        profileModel = Admin;
        profileDataToSave = { userId: savedUser._id };
        break;
      default:
        throw new Error("Invalid role specified");
    }

    const profile = new profileModel(profileDataToSave);
    const savedProfile = await profile.save();

    // Link profile to User
    savedUser.linkedProfile = savedProfile._id;
    await savedUser.save();

    // Register on blockchain
    const blockchainRole = mapRoleToBlockchain(role);
    const blockchainResult = await blockchainService.addUser(blockchainHash, blockchainRole);
    if (!blockchainResult) {
      throw new Error("Failed to register user on blockchain");
    }

    // Generate token
    const token = generateToken({ userId: savedUser._id, roles: savedUser.roles });
    return { user: savedUser, token, blockchainHash };
  } catch (error) {
    // Rollback on failure
    await User.deleteOne({ _id: savedUser._id });
    if (savedUser.linkedProfile) {
      switch (role) {
        case "donor": await Donor.deleteOne({ _id: savedUser.linkedProfile }); break;
        case "ngo": await NGO.deleteOne({ _id: savedUser.linkedProfile }); break;
        case "beneficiary": await Beneficiary.deleteOne({ _id: savedUser.linkedProfile }); break;
        case "admin": await Admin.deleteOne({ _id: savedUser.linkedProfile }); break;
      }
    }
    throw error;
  }
}

module.exports = { registerUser, login };
