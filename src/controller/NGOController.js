const NGO = require("../models/NGO");
const Proposal = require("../models/Proposal");
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

/**
 * @desc Register a new NGO
 * @route POST /api/ngos/register
 * @access Public
 */
const registerNGO = async (req, res) => {
  try {
    const { name, email, phone, address, contactPerson, country, password } = req.body;

    if (!name || !address || !email || !phone || !contactPerson) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: "NGO already registered." });
    }

    const registrationNumber = `NGO-${uuidv4().slice(0, 8).toUpperCase()}`;

    const newNGO = new NGO({
      name,
      registrationNumber,
      email,
      phone,
      address,
      verificationStatus: "Pending",
      contactPerson,
      country,
      password: hashedPassword,
    });

    const savedNGO = await newNGO.save();
    res.status(201).json({ message: "NGO registered successfully.", ngo: savedNGO });
  } catch (error) {
    console.error("Error registering NGO:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @desc Submit a funding proposal
 * @route POST /api/ngos/:ngoId/proposals
 * @access NGO only
 */
const submitProposal = async (req, res) => {
  try {
    const { ngoId } = req.params;
    const { title, description, requestedAmount, milestones } = req.body;

    // Check if NGO exists
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found." });
    }

    const newProposal = new Proposal({
      ngo: ngoId,
      title,
      description,
      requestedAmount,
      milestones: milestones || [],
      status: "Pending",
    });

    const savedProposal = await newProposal.save();

    // Add proposal reference to the NGO
    ngo.proposals.push(savedProposal._id);
    await ngo.save();

    res.status(201).json({ message: "Proposal submitted successfully.", proposal: savedProposal });

    // Web3 Integration: After saving the proposal, this is where you might need to record it on the blockchain.
    // Example:
    // const transactionHash = await web3Service.recordProposal(savedProposal);
    // Update the proposal with the transactionHash if needed.
  } catch (error) {
    console.error("Error submitting proposal:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @desc Get all NGOs
 * @route GET /api/ngos
 * @access Public
 */
const getAllNGOs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = status ? { verificationStatus: status } : {};

    const ngos = await NGO.find(filter)
      .populate("proposals")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ ngos });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @desc Verify an NGO
 * @route PUT /api/ngos/:ngoId/verify
 * @access Admin only
 */
const verifyNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found." });
    }

    ngo.verificationStatus = "Verified";
    const updatedNGO = await ngo.save();

    res.status(200).json({ message: "NGO verified successfully.", ngo: updatedNGO });

    // Web3 Integration: Record the verification status on-chain for transparency.
    // Example:
    // const transactionHash = await web3Service.verifyNGO(ngoId, "Verified");
  } catch (error) {
    console.error("Error verifying NGO:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * @desc Get a specific NGO
 * @route GET /api/ngos/:ngoId
 * @access Public
 */
const getNGOById = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const ngo = await NGO.findById(ngoId).populate("proposals");
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found." });
    }

    res.status(200).json({ ngo });
  } catch (error) {
    console.error("Error fetching NGO:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  registerNGO,
  submitProposal,
  getAllNGOs,
  verifyNGO,
  getNGOById,
};
