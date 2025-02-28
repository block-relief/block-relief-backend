const proposalService = require("../services/proposalService");

exports.createProposal = async (req, res) => {
    try {
        const { ngoId, title, description, requestedAmount, disasterId, milestones, breakdown, fundingSource } = req.body;
        const modifierId = req.user._id;
        const modifierModel = req.user.role;

        const proposal = await proposalService.createProposal(
            ngoId, title, description, requestedAmount, disasterId, milestones, breakdown, fundingSource, modifierId, modifierModel
        );

        res.status(201).json({ message: "Proposal created successfully", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const adminId = req.user._id;

        const proposal = await proposalService.approveProposal(proposalId, adminId);
        res.json({ message: "Proposal approved", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rejectProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const adminId = req.user._id;

        const proposal = await proposalService.rejectProposal(proposalId, adminId);
        res.json({ message: "Proposal rejected", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listAllProposals = async (req, res) => {
    try {
        const proposals = await proposalService.listAllProposals();
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProposal = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const proposal = await proposalService.getProposal(proposalId);
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
