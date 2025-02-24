const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  performedBy: {
    type: String,
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetModel",
    required: true,
  },
  targetModel: {
    type: String,
    enum: ["NGO", "Donor", "Beneficiary", "Transaction"],
    required: true,
  },
  details: {
    type: String,
  },
  txHash: { type: String }, // Associated blockchain transaction
  ipfsCID: { type: String }, // Proof (e.g., auditor’s signed doc)
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
