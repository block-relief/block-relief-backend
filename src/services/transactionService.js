const Transaction = require("../models/Transaction");
const Proposal = require("../models/Proposal");
const BlockchainService = require("../services/blockchain");
const Donor = require("../models/Donor");
const { v4: uuidv4 } = require("uuid");

const createDonation = async (donorId, proposalId, amount) => {
    let transaction;
    let donor;
  
    try {
      donor = await Donor.findById(donorId);
      if (!donor) {
        throw new Error("Donor not found");
      }

      if (typeof donor.totalDonations !== "number") {
        donor.totalDonations = parseFloat(donor.totalDonations) || 0;
      }
  
      transaction = new Transaction({
        donor: donorId,
        proposal: proposalId,
        amount,
        currency: "Crypto", 
        status: "Pending",
        reference: uuidv4(),
      });
      await transaction.save();
  
      const transactionHash = await BlockchainService.storeDonation({
        donorId,
        proposalId,
        amount,
        transactionId: transaction._id.toString(),
      });
  
      transaction.transactionHash = transactionHash;
      transaction.status = "Completed"; 
      await transaction.save();
  
      // Update donor contributions
      donor.contributions.push(transaction._id);
      donor.totalDonations += amount;
      donor.lastDonationDate = new Date();
      await donor.save();
  
      return { transaction, transactionHash };
    } catch (error) {
      console.error("Error during donation:", error);
  
      // Rollback logic
      if (transaction) {
        // Delete the transaction if it was created
        await Transaction.findByIdAndDelete(transaction._id);
      }
  
      if (donor) {
        // Revert donor updates
        donor.contributions = donor.contributions.filter(
          (contribution) => !contribution.equals(transaction._id)
        );
        
        if (typeof donor.totalDonations === "number") {
          donor.totalDonations -= amount;
        } else {
          donor.totalDonations = 0;
        }

        await donor.save();
      }
  
      // Propagate the error
      throw new Error(`Donation failed: ${error.message}`);
    }
  };

const donateToDisaster = async (donorId, disasterId, amount) => {
  let transaction;
  let donor;

  try {
    // Check if donor exists
    donor = await Donor.findById(donorId);
    if (!donor) {
      throw new Error("Donor not found");
    }

    if (typeof donor.totalDonations !== "number") {
      donor.totalDonations = parseFloat(donor.totalDonations) || 0;
    }

    // Create transaction in MongoDB
    transaction = new Transaction({
      donor: donorId,
      disaster: disasterId,
      amount,
      currency: "Crypto",
      status: "Pending",
      reference: uuidv4(),
    });
    await transaction.save();

    // Call blockchain service to store disaster donation
    const transactionHash = await BlockchainService.storeDisasterDonation({
      donorId,
      disasterId,
      amount,
      transactionId: transaction._id.toString(),
    });

    // Update transaction with blockchain hash
    transaction.transactionHash = transactionHash;
    transaction.status = "Completed";
    await transaction.save();

    // Update donor contributions
    donor.contributions.push(transaction._id);
    donor.totalDonations += amount;
    donor.lastDonationDate = new Date();
    await donor.save();

    return { transaction, transactionHash };
  } catch (error) {
    console.error("Error during disaster donation:", error);

    // Rollback logic
    if (transaction) {
      // Delete the transaction if it was created
      await Transaction.findByIdAndDelete(transaction._id);
    }

    if (donor) {
      // Revert donor updates
      donor.contributions = donor.contributions.filter(
        (contribution) => !contribution.equals(transaction._id)
      );

      if (typeof donor.totalDonations === "number") {
        donor.totalDonations -= amount;
      } else {
        donor.totalDonations = 0;
      }
      
      await donor.save();
    }

    // Propagate the error
    throw new Error(`Disaster donation failed: ${error.message}`);
  }
};

  
async function releaseFunds(proposalId, milestoneId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch Proposal from MongoDB
        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) throw new Error("Proposal not found");

        // Find the Milestone
        const milestone = proposal.milestones.find(m => m.milestoneId === milestoneId);
        if (!milestone) throw new Error("Milestone not found");

        // Update Milestone in MongoDB
        milestone.fundsReleased = true;
        await proposal.save({ session });

        // Call Blockchain Function to Release Funds
        const blockchainResponse = await BlockchainService.releaseFunds(proposalId, milestoneId);
        if (!blockchainResponse) {
            throw new Error("Blockchain funds release failed");
        }

        // Update Proposal with Blockchain Data (if applicable)
        proposal.blockchainHash = blockchainResponse;
        await proposal.save({ session });

        await session.commitTransaction();
        session.endSession();

        return proposal;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function listTransactions() {
    const transactions = await Transaction.find().populate("donor proposal");

    // Fetch blockchain data for each transaction
    const transactionsWithBlockchainData = await Promise.all(
        transactions.map(async (transaction) => {
            const blockchainData = await BlockchainService.getTransaction(transaction.transactionHash);
            return {
                ...transaction.toObject(),
                blockchainData
            };
        })
    );

    return transactionsWithBlockchainData;
}

module.exports = {
    releaseFunds,
    listTransactions,
    createDonation,
    donateToDisaster,
};
