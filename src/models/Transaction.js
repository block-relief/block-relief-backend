const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
  },
  disaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Disaster"
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    enum: ["USD", "EUR", "GHS", "Crypto"],
    required: true,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beneficiary",
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Reversed"],
    default: "Pending",
  },
  transactionHash: {
    type: String, // For blockchain transactions
  },
  reference: {
    type: String, // Internal reference number
    unique: true,
    sparse: true,
  },
  paymentrovider: {
    type: String, enum: ["Paystack", "MockCrypto"],
    default: "MockCrypto"
  },
  paymentStatus: {
    type: String,
    enum: ["Initiated", "Pending", "Completed", "Failed"],
    default: "Initiated"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
