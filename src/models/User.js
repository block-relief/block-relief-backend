const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, default: '', required: false }, // Primary identifier (ICP/ETH)
  email: { type: String, sparse: true },
  roles: [{ 
    type: String, 
    enum: ['donor', 'ngo', 'beneficiary', 'auditor', 'admin'], 
    required: true 
  }],
  linkedProfile : { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'roles' // Dynamically links to the correct model based on role
  },
  notificationsEnabled: { type: Boolean, default: true },
  twoFactorEnabled: { type: Boolean, default: false },
  profile: {
    name: { type: String, required: true },
    location: String,
    phone: String // Should be encrypted at the service level for privacy
  },
  blockchainHash: { type: String }, // Consider making required if always set
  password: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"], // Lowercase for consistency
    default: "pending"
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ref "User" since admin is a role
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
