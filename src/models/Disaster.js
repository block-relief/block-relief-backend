const mongoose = require("mongoose");

const DisasterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["Flood", "Earthquake", "Hurricane", "Wildfire", "Pandemic", "Other"], required: true },
  location: {
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number,
  },
  severity: { type: String, enum: ["Low", "Moderate", "Severe", "Critical"], required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
  externalSource: { name: String, url: String }, 
  totalEstimatedDamage: { type: Number, default: 0 }, 
  totalVerifiedDamage: { type: Number, default: 0 }, 
  totalContributions: { type: Number, default: 0 },
  contributions: [
    {
      transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  damageReports: [{ name: String, ipfsCID: String, uploadedAt: Date }], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model("Disaster", DisasterSchema);
