const mongoose = require("mongoose");

const FundRequestSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
    required: true,
  },
  disaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Disaster",
    required: true,
  },
  amountRequested: {
    type: Number,
    required: true,
    min: 1,
  },
  justification: {
    type: String,
    required: true,
    trim: true, // Why do they need the money?
  },
  evidence: [
    {
      name: String,
      ipfsCID: String, // Uploads (ID, damage proof, etc.)
      uploadedAt: Date,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Paid"],
    default: "Pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  blockchainHash: {
    type: String, // If funded via blockchain
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("FundRequest", FundRequestSchema);
