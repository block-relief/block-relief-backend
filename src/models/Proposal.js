const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  requestedAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Partially Funded"],
    default: "Pending",
  },
  disaster: { type: mongoose.Schema.Types.ObjectId, ref: "Disaster", required: true },
  milestones: [
    {
      milestoneId: { type: Number, required: true },
      description: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      fundsAllocated: { type: Number, default: 0 },
      fundsReleased: { type: Boolean, default: false },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  aidRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "AidRequest" }],
  breakdown: { type: String, required: true },
  deadline: { type: Date }, // Expiry date for proposal
  fundingSource: { type: String, trim: true },
  blockchainHash: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "modifierModel",
  },
  modifierModel: {
    type: String,
    required: true,
    enum: ["Donor", "Beneficiary"],
  },
});

module.exports = mongoose.model("Proposal", ProposalSchema);
