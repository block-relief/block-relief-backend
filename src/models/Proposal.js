const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  requestedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Partially Funded"],
    default: "Pending",
  },
  milestones: [
    {
      milestoneId: Number,
      description: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      fundsAllocated: Number,
      fundsReleased: { type: Boolean, default: false },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  deadline: {
    type: Date, // Proposal expiration or evaluation deadline
  },
  fundingSource: {
    type: String, // Internal or external funding source
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "modifierModel",
  },
  modifierModel: {
    type: String,
    required: true,
    enum: ["Donor", "Beneficiary"], 
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Proposal", ProposalSchema);
