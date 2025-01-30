const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dob: {
    type: Date,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Verified", "Rejected"],
    default: "Unverified",
  },
  aidRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AidRequest",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);
