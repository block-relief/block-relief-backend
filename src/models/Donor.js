const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  anonymous: { type: Boolean, default: false },
  paymentMethods: [{ 
    type: String, 
    enum: ["Credit Card", "PayPal", "Crypto", "Bank Transfer"] 
  }],
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  totalDonations: { type: Number, default: 0 }, 
  lastDonationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model("Donor", DonorSchema);
