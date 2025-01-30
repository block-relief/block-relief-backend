const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  preferredPaymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Crypto", "Bank Transfer"],
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  contributions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
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

module.exports = mongoose.model("Donor", DonorSchema);
