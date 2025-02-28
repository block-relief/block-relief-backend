const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const NGO = require("../models/NGO");
const blockchainService = require("../services/blockchain");
const { mapRoleToBlockchain } = require("../utils/mapRoles");

(async () => {
  const { create } = await import('ipfs-http-client');
  const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
})()

const HASH_SALT = process.env.HASH_SALT || "your-secret-salt";

// Register NGO (Step 1: Lightweight signup)
async function registerNGO(email, password, name, registrationNumber, phone, address, country, contactPerson) {
  if (await User.findOne({ email })) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userHash = crypto.createHash('sha256').update(email + HASH_SALT).digest('hex');

  const user = new User({
    email,
    password: hashedPassword,
    roles: ["ngo"],
    verificationStatus: "pending",
    blockchainHash: userHash,
    profile: { name }
  });
  const savedUser = await user.save();

  const ngo = new NGO({
    userId: savedUser._id,
    registrationNumber,
    phone,
    address,
    country,
    contactPerson
  });
  const savedNGO = await ngo.save();

  // Link NGO profile to User
  savedUser.linkedProfile = savedNGO._id;
  await savedUser.save();

  const blockchainResult = await blockchainService.addUser(userHash, "NGO");
  if (!blockchainResult) {
    await User.deleteOne({ _id: savedUser._id });
    await NGO.deleteOne({ _id: savedNGO._id });
    throw new Error("Failed to register NGO on blockchain");
  }

  return { userHash, userId: savedUser._id };
}

// Submit NGO Documents (Step 2: Upload to IPFS)
async function submitNGODocs(userHash, files) {
  const user = await User.findOne({ blockchainHash: userHash });
  if (!user || !user.roles.includes("ngo")) {
    throw new Error("NGO not found");
  }

  const expectedDocNames = ["registration", "tax_cert", "proof_of_op"];
  if (files.length > expectedDocNames.length) {
    throw new Error("Too many documents uploaded");
  }

  const ipfsHashes = await Promise.all(
    files.map(async (file, index) => {
      const content = Buffer.from(file.buffer);
      const result = await ipfs.add(content);
      return {
        name: expectedDocNames[index] || `extra_doc_${index}`,
        ipfsCID: result.path
      };
    })
  );

  await NGO.updateOne(
    { userId: user._id },
    { $push: { documents: { $each: ipfsHashes } } }
  );

  return { ipfsHashes };
}

// Retrieve NGO Documents
async function getNGODocs(userHash) {
  const user = await User.findOne({ blockchainHash: userHash });
  if (!user || !user.roles.includes("ngo")) {
    throw new Error("NGO not found");
  }

  const ngo = await NGO.findOne({ userId: user._id });
  if (!ngo) {
    throw new Error("NGO profile not found");
  }

  return { documents: ngo.documents };
}

async function listVerifiedNGOs() {
  try {
    const ngos = await blockchainService.listVerifiedNGOs();
    return ngos; 
  } catch (error) {
    throw new Error(`Failed to list verified NGOs: ${error.message}`);
  }
}

module.exports = { registerNGO, submitNGODocs, getNGODocs, listVerifiedNGOs };