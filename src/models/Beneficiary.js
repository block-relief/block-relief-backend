const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Ensures one-to-one mapping
  },
  dob: { type: Date },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  verificationStatus: {
    type: String,
    enum: ["Unverified", "Pending", "Verified", "Rejected"],
    default: "Unverified",
  },
  aidRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "AidRequest" }],
  documents: [
    {
      type: {
        type: String,
        enum: ["ID", "Certificate", "MedicalReport"],
      },
      fileUrl: String, // IPFS or cloud storage link
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  disasterHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disaster" }], // Past disasters
  aidRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "AidRequest" }],
  totalAidReceived: { type: Number, default: 0 }, // Running total for quick analytics
  lastAidReceivedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model("Beneficiary", BeneficiarySchema);
