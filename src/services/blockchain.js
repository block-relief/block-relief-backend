const { HttpAgent, Actor } = require("@dfinity/agent");
const { idlFactory: VerificationIDL } = require("../contracts/src/declarations/verification/verification.did.js");
const { idlFactory: EscrowIDL } = require("../contracts/src/declarations/escrow/escrow.did.js");
const dotenv = require('dotenv')

dotenv.config()

const VERIFICATION_CANISTER_ID = process.env.VERIFICATION_CANISTER_ID;
const ESCROW_CANISTER_ID = process.env.ESCROW_CANISTER_ID;

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
// Fetch root key for local replica (remove this line when deploying to mainnet)
agent.fetchRootKey().catch(err => console.error("Error fetching root key:", err));

// Create actor instances for smart contract interaction
const VerificationActor = Actor.createActor(VerificationIDL, {
  agent,
  canisterId: VERIFICATION_CANISTER_ID,
});

const EscrowActor = Actor.createActor(EscrowIDL, {
  agent,
  canisterId: ESCROW_CANISTER_ID,
});

class BlockchainService {
  async verifyNGO(ngoId) {
    try {
      return await VerificationActor.verifyNGO(ngoId);
    } catch (error) {
      console.error("Error verifying NGO:", error);
      return false;
    }
  }

  async verifyBeneficiary(beneficiaryId) {
    try {
      return await VerificationActor.verifyBeneficiary(beneficiaryId);
    } catch (error) {
      console.error("Error verifying Beneficiary:", error);
      return false;
    }
  }

  async getNGOStatus(ngoId) {
    return await VerificationActor.getNGOStatus(ngoId);
  }

  async getBeneficiaryStatus(beneficiaryId) {
    return await VerificationActor.getBeneficiaryStatus(beneficiaryId);
  }

  async createProposal(proposalId, ngoId, totalAmount, milestones) {
    try {
      return await EscrowActor.createProposal(proposalId, ngoId, totalAmount, milestones);
    } catch (error) {
      console.error("Error creating proposal:", error);
      return false;
    }
  }

  async releaseFunds(proposalId, milestoneId) {
    try {
      return await EscrowActor.releaseFunds(proposalId, milestoneId);
    } catch (error) {
      console.error("Error releasing funds:", error);
      return false;
    }
  }

  async getProposal(proposalId) {
    return await EscrowActor.getProposal(proposalId);
  }
}

module.exports = new BlockchainService();