const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, required: true }, // Primary identifier (ICP/ETH)
    email: { type: String, sparse: true },
    roles: [{ 
      type: String, 
      enum: ['donor', 'ngo', 'beneficiary', 'auditor', 'admin'], 
      required: true 
    }], 
    linkedProfile: { 
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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
