const mongoose = require("mongoose");

const AidRequestSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "requesterType", // Dynamic reference (either NGO or Beneficiary)
    required: true,
  },
  requesterType: {
    type: String,
    enum: ["NGO", "Beneficiary"],
    required: true,
  },
  items: [{
    type: { type: String, enum: ['food', 'shelter', 'medicine', 'cash'] },
    quantity: Number
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  estimatedCost: { type: Number, required: true },
  evidence: [
    {
      name: String,
      ipfsCID: String, // Proof (photos, videos, documents)
      uploadedAt: Date,
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Fulfilled", "Rejected", "InProgress"],
    default: "Pending",
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
  },
  location: {
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
  },
  requestHash: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("AidRequest", AidRequestSchema);
