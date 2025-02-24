const mongoose = require("mongoose");

const NGOSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one-to-one mapping
  },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, trim: true },
  country: { type: String, required: true },
  contactPerson: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  verificationStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  logo: { type: String }, // Store URL or IPFS CID
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  disasterZones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disaster" }],
  documents: [
    {
      name: { type: String, required: true },
      ipfsCID: { type: String, required: true }, 
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  walletAddress: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("NGO", NGOSchema);
