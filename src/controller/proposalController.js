const proposalService = require("../services/proposalService");

async function createProposal (req, res) {
    try {
        const { ngoId, title, description, requestedAmount, disasterId, milestones, breakdown, fundingSource } = req.body;
        const modifierId = req.user._id;
        console.log('logged in user:', req.user)
        const modifierModel = req.user.roles[0];

        const proposal = await proposalService.createProposal(
            ngoId, title, description, requestedAmount, disasterId, milestones, breakdown, fundingSource, modifierId, modifierModel
        );

        res.status(201).json({ message: "Proposal created successfully", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function approveProposal (req, res) {
    try {
        const { proposalId } = req.params;
        const adminId = req.user._id;

        const proposal = await proposalService.approveProposal(proposalId, adminId);
        res.json({ message: "Proposal approved", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function rejectProposal (req, res) {
    try {
        const { proposalId } = req.params;
        const adminId = req.user._id;

        const proposal = await proposalService.rejectProposal(proposalId, adminId);
        res.json({ message: "Proposal rejected", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function listAllProposals (req, res) {
    try {
        const proposals = await proposalService.listAllProposals();
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getProposal(req, res) {
    try {
        const { proposalId } = req.params;
        const proposal = await proposalService.getProposal(proposalId);
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

async function getTotalDonationsForProposal(req, res) {
  try {
    const { proposalId } = req.params;
    const total = await proposalService.getTotalDonationsForProposal(proposalId);
    res.status(200).json({ proposalId, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    getTotalDonationsForProposal,
    getProposal,
    listAllProposals,
    rejectProposal,
    approveProposal,
    createProposal,
}
