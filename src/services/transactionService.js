const Transaction = require("../models/Transaction");
const Proposal = require("../models/Proposal");
// const BlockchainService = require("../services/blockchain");
const Donor = require("../models/Donor");
const Disaster = require('../models/Disaster')
const User = require("../models/User")
const { v4: uuidv4 } = require("uuid");
const paystackService = require('../utils/paymentUtils')

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
  
      // const transactionHash = await BlockchainService.storeDonation({
      //   donorId,
      //   proposalId,
      //   amount,
      //   transactionId: transaction._id.toString(),
      // });
  
      // transaction.transactionHash = transactionHash;
      transaction.status = "Completed"; 
      await transaction.save();
  
      // Update donor contributions
      donor.contributions.push(transaction._id);
      donor.totalDonations += amount;
      donor.lastDonationDate = new Date();
      await donor.save();
  
      return { transaction };
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
    // const transactionHash = await BlockchainService.storeDisasterDonation({
    //   donorId,
    //   disasterId,
    //   amount,
    //   transactionId: transaction._id.toString(),
    // });

    // // Update transaction with blockchain hash
    // transaction.transactionHash = transactionHash;
    transaction.status = "Completed";
    await transaction.save();

    // Update donor contributions
    donor.contributions.push(transaction._id);
    donor.totalDonations += amount;
    donor.lastDonationDate = new Date();
    await donor.save();

    return { transaction };
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
        milestone.isReleased = true;
        await proposal.save({ session });

        // Call Blockchain Function to Release Funds
        // const blockchainResponse = await BlockchainService.releaseFunds(proposalId, milestoneId);
        // if (!blockchainResponse) {
        //     throw new Error("Blockchain funds release failed");
        // }

        // // Update Proposal with Blockchain Data (if applicable)
        // proposal.blockchainHash = blockchainResponse;
        // await proposal.save({ session });

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

async function listTransactions() {
  try {
    // Fetch all transactions from MongoDB and populate donor and proposal fields
    const transactions = await Transaction.find()
      .populate('donor')     
      .exec();

    return transactions.map(transaction => transaction.toObject());
  } catch (error) {
    throw new Error(`Failed to list transactions: ${error.message}`);
  }
}

async function donateToProposalFiat({ donorId, proposalId, amount, email, currency = "GHS" }) {
  const transaction = new Transaction({
    donor: donorId,
    proposal: proposalId,
    amount,
    currency,
    reference: uuidv4(),
    paymentProvider: "Paystack",
    status: "Pending",
    paymentStatus: "Initiated"
  })
  await transaction.save()

  const paymentData = await paystackService.initiatePayment({
    amount,
    email,
    metadata: { donorId, proposalId },
  })

  const reference = paymentData.reference
  transaction.reference = reference
  transaction.save()

  return { transaction, response: paymentData }
}

async function donateToDisasterFiat({ donorId, disasterId, amount, email, currency = "GHS" }) {
  const transaction = new Transaction({
    donor: donorId,
    disaster: disasterId,
    amount,
    currency,
    reference: uuidv4(),
    paymentProvider: "Paystack",
    status: "Pending",
    paymentStatus: "Initiated",
  });
  await transaction.save();

  const paymentData = await paystackService.initiatePayment({
    amount,
    email,
    metadata: { donorId, disasterId },
  });

  const reference = paymentData.reference
  transaction.reference = reference
  transaction.save()

  return { transaction, response: paymentData };
}

async function verifyPayment(reference) {
  try {
    const paymentData = await paystackService.verifyPayment(reference);
    const transaction = await Transaction.findOne({ reference: reference });
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Check if transaction is already verified
    if (transaction.status === "Completed") {
      console.log(`Transaction ${reference} already completed. Skipping updates.`);
      return transaction;
    }

    if (paymentData.status === "success") {
      transaction.status = "Completed";
      transaction.paymentStatus = "Completed";
      await transaction.save();

      const donor = await Donor.findOne({ userId: transaction.donor });
      if (!donor) {
        throw new Error("Donor not found");
      }

      // Check if donation is already recorded for the donor
      const donationExists = donor.contributions.some((contrib) =>
        contrib.equals(transaction._id)
      );
      if (!donationExists) {
        donor.contributions.push(transaction._id);
        donor.totalDonations += transaction.amount;
        donor.lastDonationDate = new Date();
        await donor.save();
      } else {
        console.log(`Donation already recorded for donor ${transaction.donor}`);
      }

      // Update proposal or disaster (idempotent check)
      if (transaction.proposal) {
        const proposal = await Proposal.findById(transaction.proposal);
        if (!proposal) {
          throw new Error("Proposal not found");
        }
        const contributionExists = proposal.contributions.some((c) =>
          c.transactionId.equals(transaction._id)
        );
        if (!contributionExists) {
          proposal.totalContributions += transaction.amount;
          proposal.contributions.push({
            transactionId: transaction._id,
            donorId: donor._id,
            amount: transaction.amount,
            date: new Date(),
          });
          await proposal.save();
        } else {
          console.log(`Contribution already recorded for proposal ${transaction.proposal}`);
        }
      } else if (transaction.disaster) {
        const disaster = await Disaster.findById(transaction.disaster);
        if (!disaster) {
          throw new Error("Disaster not found");
        }
        const contributionExists = disaster.contributions.some((c) =>
          c.transactionId.equals(transaction._id)
        );
        if (!contributionExists) {
          disaster.totalContributions += transaction.amount;
          disaster.contributions.push({
            transactionId: transaction._id,
            donorId: donor._id,
            amount: transaction.amount,
            date: new Date(),
          });
          await disaster.save();
        } else {
          console.log(`Contribution already recorded for disaster ${transaction.disaster}`);
        }
      } else {
        throw new Error("Transaction must be associated with either a proposal or a disaster");
      }
    } else {
      transaction.status = "Failed";
      transaction.paymentStatus = "Failed";
      await transaction.save();
    }
    return transaction;
  } catch (error) {
    console.error("Paystack verification failed:", error.message);
    throw new Error("Paystack verification failed: " + error.message);
  }
}


module.exports = {
    releaseFunds,
    listTransactions,
    createDonation,
    donateToDisaster,
    donateToProposalFiat,
    verifyPayment,
    donateToDisasterFiat,
};
