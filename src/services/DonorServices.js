const mongoose = require('mongoose')
const User = require("../models/User");
const Donor = require("../models/Donor");
const Transaction = require('../models/Transaction')


async function getDonorDonationDetails(donorId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(donorId)) {
        throw new Error("Invalid donorId format");
      }
  
      const user = await User.findById(donorId).select("profile.name");
      if (!user || !user.profile || !user.profile.name) {
        throw new Error("User not found or name unavailable");
      }
  
      const donor = await Donor.findOne({ userId: donorId });
      if (!donor) {
        throw new Error("Donor record not found for this user");
      }
  
      const transactions = await Transaction.find({
        donor: donorId, 
        status: "Completed",
      })
        .populate("proposal", "title")
        .populate("disaster", "name");
  
      if (!transactions.length) {
        return {
          donorName: user.profile.name,
          donations: [],
        };
      }
  
      const totalDonations = transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

      const donations = transactions.map((transaction) => ({
        amountDonated: transaction.amount,
        proposalDonatedTo: transaction.proposal ? transaction.proposal.title : null,
        disasterDonatedTo: transaction.disaster ? transaction.disaster.name : null,
        transactionDate: transaction.updatedAt || transaction.createdAt,
        currency: transaction.currency,
      }));
  
      return {
        donorName: user.profile.name,
        donations,
        totalDonations,
      };
    } catch (error) {
      console.error("Error fetching donor donation details:", error.message);
      throw new Error("Failed to fetch donor donation details: " + error.message);
    }
  }

module.exports = {
     getDonorDonationDetails,
    };