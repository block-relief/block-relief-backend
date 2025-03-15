const User = require("../models/User");
const NGO = require("../models/NGO");
// const blockchainService = require("../services/blockchain");
const { config } = require('../config/config')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

async function submitNGODocs(userHash, files) {
  const user = await User.findOne({ blockchainHash: userHash });
  if (!user || !user.roles.includes("ngo")) {
    throw new Error("NGO not found");
  }

  // Validate files
  if (!files || Object.keys(files).length !== 3) {
    throw new Error("Exactly 3 documents (registration, tax_cert, proof_of_op) required");
  }

  const expectedDocFields = ["registration", "tax_cert", "proof_of_op"];
  const cloudinaryUploads = {};

  // Upload each file to Cloudinary
  for (const field of expectedDocFields) {
    if (!files[field] || !files[field][0]) {
      throw new Error(`Missing ${field} document`);
    }

    const file = files[field][0];
    if (!file.buffer) {
      throw new Error(`File buffer missing for ${field}`);
    }

    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `ngo/${userHash}`, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    cloudinaryUploads[field] = {
      name: field,
      cloudinaryUrl: uploadResponse.secure_url,
      originalName: file.originalname,
      uploadedAt: new Date(),
    };
  }

  const ngo = await NGO.findOne({ userId: user._id });
  if (!ngo) throw new Error("NGO not found in update");

  await NGO.updateOne(
    { userId: user._id },
    { $set: { documents: Object.values(cloudinaryUploads) } }, 
    { upsert: true } 
  );

  return { cloudinaryUploads: Object.values(cloudinaryUploads) };
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

// async function listVerifiedNGOs() {
//   try {
//     const ngos = await blockchainService.listVerifiedNGOs();
//     return ngos; 
//   } catch (error) {
//     throw new Error(`Failed to list verified NGOs: ${error.message}`);
//   }
// }

async function listVerifiedNGOs() {
  try {
    const ngos = await User.find({
      verificationStatus: 'verified', 
      roles: { $in: ['ngo'] }     
    }).exec();

    return ngos; 
  } catch (error) {
    throw new Error(`Failed to list verified NGOs: ${error.message}`);
  }
}

module.exports = {  submitNGODocs, getNGODocs, listVerifiedNGOs };