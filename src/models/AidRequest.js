const mongoose = require("mongoose");

const AidRequestSchema = new mongoose.Schema({
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
    required: true,
  },
  requestType: {
    type: String,
    required: true,
  },
  items: [{
    type: { type: String, enum: ['food', 'shelter', 'medicine'] },
    quantity: Number
  }],
  description: {
    type: String,
    trim: true,
  },
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
    latitude: { type: Number },
    longitude: { type: Number },
  },
  urgency: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium",
  },
  requestHash: {
    type: String,
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
