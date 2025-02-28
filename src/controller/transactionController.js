const transactionService = require("../services/transactionService");

exports.donateToProposal = async (req, res) => {
    try {
        const { proposalId, amount, currency, transactionHash } = req.body;
        const donorId = req.user._id;

        const transaction = await transactionService.donateToProposal(donorId, proposalId, amount, currency, transactionHash);
        res.status(201).json({ message: "Donation successful", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.listTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.listTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.releaseFunds = async (req, res) => {
    try {
        const { proposalId, milestoneId } = req.body;

        // Call the service function (which now includes Web3 integration)
        const proposal = await transactionService.releaseFunds(proposalId, milestoneId);

        // Respond to the client
        res.status(200).json({ message: "Funds released successfully", proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
