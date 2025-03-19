const transactionService = require("../services/transactionService");


async function createDonation(req, res) {
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
        reference: result.transaction.reference
      },
    });
  } catch (error) {
    console.error("Donation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


async function donateToDisaster(req, res) {
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
        reference: result.transaction.reference
      },
    });
  } catch (error) {
    console.error("Donation error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


async function listTransactions(req, res) {
    try {
        const transactions = await transactionService.listTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


async function releaseFunds(req, res) {
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

async function donateToProposalFiat(req, res) {
  try {
    const { proposalId, amount, email } = req.body;
    const donorId = req.user.userId; 
    const { transaction, response } = await transactionService.donateToProposalFiat({
      donorId,
      proposalId,
      amount,
      email,
    });
    res.status(201).json({ transaction, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function donateToDisasterFiat(req, res) {
  try {
    const { disasterId, amount, email } = req.body;
    const donorId = req.user.userId;
    const { transaction, response } = await transactionService.donateToDisasterFiat({
      donorId,
      disasterId,
      amount,
      email,
    });
    res.status(201).json({ transaction, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function verifyPayment(req, res) {
  try {
    const { reference } = req.body; // Or from webhook
    const transaction = await transactionService.verifyPayment(reference);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



module.exports = {
  donateToProposalFiat,
  donateToDisasterFiat,
  verifyPayment,
  releaseFunds,
  listTransactions,
  donateToDisaster,
  createDonation
}
