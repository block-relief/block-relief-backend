const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true }, // Primary identifier (ICP/ETH)
    email: { type: String, sparse: true },
    role: { 
      type: String, 
      enum: ['donor', 'ngo', 'victim', 'auditor', 'admin'], 
      required: true 
    },
    notificationsEnabled: {
        type: Boolean,
        default: true,
      },
    permissions: { // RBAC granular control
      canVerifyNGO: { type: Boolean, default: false }, // Auditors only
      canReleaseFunds: { type: Boolean, default: false }, // Admins/NGOs (milestone-based)
      canSubmitProposals: { type: Boolean, default: false } // NGOs only
    },
    profile: {
      name: String,
      location: String, // For victims/donors
      phone: String // Encrypted field
    },
    twoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('User', UserSchema)