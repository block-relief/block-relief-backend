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
    required: true,
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
