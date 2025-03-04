const beneficiaryService = require("../services/beneficiaryService");

async function registerBeneficiary(req, res) {
    try {
        const { walletAddress, email, password, aidRequestDetails } = req.body;
        const result = await beneficiaryService.registerBeneficiary(walletAddress, email, password, aidRequestDetails);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function listVerifiedBeneficiariesController(req, res) {
    try {
      const beneficiaries = await listVerifiedBeneficiaries();
      res.status(200).json({ beneficiaries });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

module.exports = { registerBeneficiary, listVerifiedBeneficiariesController };
