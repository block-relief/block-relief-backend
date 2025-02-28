const Transaction = require("../models/Transaction");
const Proposal = require("../models/Proposal");
const BlockchainService = require("../services/blockchain");

async function donateToProposal(donorId, proposalId, amount, currency, transactionHash) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create MongoDB Transaction
        const transaction = new Transaction({
            donor: donorId,
            proposal: proposalId,
            amount,
            currency,
            transactionHash,
            status: "Pending",
        });

        const savedTransaction = await transaction.save({ session });

        // Update Proposal funding status in MongoDB
        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) throw new Error("Proposal not found");

        proposal.status = "Partially Funded";
        await proposal.save({ session });

        // Call Blockchain Function to Record Donation
        const blockchainResponse = await BlockchainService.requestAid(donorId, amount);
        if (!blockchainResponse) {
            throw new Error("Blockchain donation recording failed");
        }

        // Update Transaction with Blockchain Data
        savedTransaction.blockchainHash = blockchainResponse;
        savedTransaction.status = "Completed";
        await savedTransaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return savedTransaction;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

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
    donateToProposal,
    releaseFunds,
    listTransactions
};
