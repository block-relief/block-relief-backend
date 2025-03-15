const Disaster = require("../models/Disaster");
const Proposal = require("../models/Proposal")
// const BlockchainService = require("./blockchain");
const mongoose = require("mongoose");

async function reportDisaster({ name, type, location, severity, reportedBy }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create MongoDB Disaster
    const disaster = new Disaster({
      name,
      type,
      location,
      severity,
      reportedBy,
      status: "Active",
    });
    const savedDisaster = await disaster.save({ session });

    // const blockchainResponse = await BlockchainService.reportDisaster(
    //   savedDisaster._id.toString(),
    //   `${name}: ${type}`, // description
    //   `${location.city || ""}, ${location.country || ""}`, // location
    //   0.0, // estimatedDamageCost (placeholder for MVP)
    //   reportedBy.toString()
    // );

    // if (!blockchainResponse) {
    //   throw new Error("Blockchain disaster report failed");
    // }

    await session.commitTransaction();
    session.endSession();
    return savedDisaster;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

async function listAllDisasters() {
  const disasters = await Disaster.find().populate("reportedBy");
  return disasters;
}

async function getDisaster(disasterId) {
  const disaster = await Disaster.findById(disasterId).populate("reportedBy");
  if (!disaster) throw new Error("Disaster not found");
  // const blockchainData = await BlockchainService.getDisaster(disasterId);
  return { ...disaster.toObject()};
}

async function getProposalByDisaster(disasterId) {
  const disaster = await Disaster.findById(disasterId)
  if (!disaster) {
    throw new Error("Disaster not found")
  }

  const proposals = await Proposal.find({ disaster: disasterId }).populate("ngo")

  // const proposalsWithBlockchainData = await Promise.all(
  //   proposals.map(async (proposal) => {
  //     const blockchainData = await BlockchainService.getProposal(proposal._id.toString())

  //     // Convert BigInt values to strings
  //     const sanitizedBlockchainData = JSON.parse(
  //       JSON.stringify(blockchainData, (key, value) =>
  //         typeof value === "bigint" ? value.toString() : value
  //     )
  //   );

  //     return {
  //       ...proposal.toObject(),
  //       blockchainData: sanitizedBlockchainData,
  //     }
  //   })
  // )

  // return proposalsWithBlockchainData;

  return proposals
}

module.exports = { reportDisaster, listAllDisasters, getDisaster, getProposalByDisaster };