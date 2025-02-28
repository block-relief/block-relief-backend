const mongoose = require('mongoose')

const NGOSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  registrationNumber: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, trim: true },
  country: { type: String, required: true },
  contactPerson: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  logo: { type: String }, // IPFS CID
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  disasterZones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disaster" }],
  documents: [
    {
      name: { type: String, required: true, enum: ["registration", "tax_cert", "proof_of_op"] }, // Controlled names
      ipfsCID: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('NGO', NGOSchema)