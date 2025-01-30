const mongoose = require("mongoose");

const NGOSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
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
  logo: {
    type: String, 
  },
  proposals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
    },
  ],
  disasterZones: [{ type: String }],
  documents: [{ // IPFS CIDs of uploaded docs (tax certs, audits)
    name: String,
    ipfsCID: String,
    uploadedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("NGO", NGOSchema);
