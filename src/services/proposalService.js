const Proposal = require("../models/Proposal");
// const BlockchainService = require("./blockchain");
const { generateToken, createSalt } = require('../utils/generateToken_')
const NGO = require("../models/NGO")
const mongoose = require("mongoose");

async function createProposal(ngoId, title, description, requestedAmount, disasterId, milestones, breakdown, fundingSource, modifierId, modifierModel) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create MongoDB Proposal
        const proposal = new Proposal({
            ngo: ngoId,
            title,
            description,
            requestedAmount,
            disaster: disasterId,
            milestones,
            breakdown,
            fundingSource,
            lastModifiedBy: modifierId,
            modifierModel
        });

        const savedProposal = await proposal.save({ session });

        const ngo = await NGO.findById(ngoId).session(session);
        if (!ngo) {
            throw new Error("NGO not found");
        }
        ngo.proposals.push(savedProposal._id);
        await ngo.save({ session });

        // Call Blockchain Function
        // const blockchainResponse = await BlockchainService.createProposal(
        //     savedProposal._id.toString(), 
        //     ngoId,
        //     requestedAmount,
        //     milestones
        // );

        // if (!blockchainResponse) {
        //     throw new Error("Blockchain proposal creation failed");
        // }

        // // Store Blockchain Hash
        // savedProposal.blockchainHash = blockchainResponse;
        // await savedProposal.save({ session });

        await session.commitTransaction();
        session.endSession();

        return savedProposal;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function approveProposal(proposalId, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) throw new Error("Proposal not found");

        // Update MongoDB Proposal
        proposal.status = "Approved";
        proposal.lastModifiedBy = adminId;
        proposal.modifierModel = "Admin";

        // // Call Blockchain Function (if applicable)
        // const blockchainResponse = await BlockchainService.markProposalCompleted(proposalId);
        // if (!blockchainResponse) {
        //     throw new Error("Blockchain proposal approval failed");
        // }

        // // Store Blockchain Hash (if applicable)
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


async function rejectProposal(proposalId, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const proposal = await Proposal.findById(proposalId).session(session);
        if (!proposal) throw new Error("Proposal not found");

        // Update MongoDB Proposal
        proposal.status = "Rejected";
        proposal.lastModifiedBy = adminId;
        proposal.modifierModel = "admin";

        // // Call Blockchain Function (if applicable)
        // const blockchainResponse = await BlockchainService.withdrawRemainingFunds(proposalId);
        // if (!blockchainResponse) {
        //     throw new Error("Blockchain proposal rejection failed");
        // }

        // // Store Blockchain Hash (if applicable)
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

// async function listAllProposals() {
//     const proposals = await Proposal.find().populate("ngo disaster");

//     // Fetch blockchain data for each proposal
//     const proposalsWithBlockchainData = await Promise.all(
//         proposals.map(async (proposal) => {
//             const blockchainData = await BlockchainService.getProposal(proposal._id.toString());
//             return {
//                 ...proposal.toObject(),
//                 blockchainData
//             };
//         })
//     );

//     return proposalsWithBlockchainData;
// }

async function listAllProposals() {
    try {
      const proposals = await Proposal.find()
        .populate('ngo')       
        .populate('disaster')  
        .exec();
  
      return proposals.map(proposal => proposal.toObject());
    } catch (error) {
      throw new Error(`Failed to list all proposals: ${error.message}`);
    }
  }

// async function getProposal(proposalId) {
//     const proposal = await Proposal.findById(proposalId).populate("ngo disaster");
//     if (!proposal) throw new Error("Proposal not found");

//     // Fetch blockchain data
//     const blockchainData = await BlockchainService.getProposal(proposalId);

//     return {
//         ...proposal.toObject(),
//         blockchainData
//     };
// }


async function getProposal(proposalId) {
    try {
      const proposal = await Proposal.findById(proposalId)
        .populate('ngo')       
        .populate('disaster')  
        .exec();
  
      if (!proposal) throw new Error("Proposal not found");
  
      return proposal.toObject();
    } catch (error) {
      throw new Error(`Failed to get proposal: ${error.message}`);
    }
  }

async function getTotalDonationsForProposal(proposalId) {
  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    throw new Error("Proposal not found");
  }
  return proposal.totalContributions;
}


module.exports = {
    createProposal,
    approveProposal,
    rejectProposal,
    listAllProposals,
    getProposal,
    getTotalDonationsForProposal,
};
