const transactionService = require("../services/transactionService");


exports.createDonation = async (req, res) => {
  try {
    const { donorId, proposalId, amount } = req.body;

    if (!donorId || !proposalId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const parsedAmount = parseFloat(amount)

    const result = await transactionService.createDonation(donorId, proposalId, parsedAmount);

    return res.status(201).json({
      message: "Donation successful",
      transaction: {
        id: result.transaction._id,
        reference: result.transaction.reference,
        transactionHash: result.transactionHash,
      },
    });
  } catch (error) {
    console.error("Donation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


exports.donateToDisaster = async (req, res) => {
  try {
    const { donorId, disasterId, amount } = req.body;

    if (!donorId || !disasterId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const parsedAmount = parseFloat(amount);

    const result = await transactionService.donateToDisaster(donorId, disasterId, parsedAmount);

    return res.status(201).json({
      message: "Donation successful",
      transaction: {
        id: result.transaction._id,
        reference: result.transaction.reference,
        transactionHash: result.transactionHash,
      },
    });
  } catch (error) {
    console.error("Donation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
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
