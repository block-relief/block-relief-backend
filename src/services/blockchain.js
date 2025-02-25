const { HttpAgent, Actor } = require("@dfinity/agent");
const { idlFactory: VerificationIDL } = require("../contracts/src/declarations/verification/verification.did.js");
const { idlFactory: EscrowIDL } = require("../contracts/src/declarations/escrow/escrow.did.js");
const { idlFactory: FundingIDL } = require("../contracts/src/declarations/funding/funding.did.js");
const { idlFactory: DisasterIDL } = require("../contracts/src/declarations/disaster/disaster.did.js");
const dotenv = require("dotenv");

dotenv.config();

const VERIFICATION_CANISTER_ID = process.env.VERIFICATION_CANISTER_ID;
const ESCROW_CANISTER_ID = process.env.ESCROW_CANISTER_ID;
const FUNDING_CANISTER_ID = process.env.FUNDING_CANISTER_ID;
const DISASTER_CANISTER_ID = process.env.DISASTER_CANISTER_ID;

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

const FundingActor = Actor.createActor(FundingIDL, {
  agent,
  canisterId: FUNDING_CANISTER_ID,
});

const DisasterActor = Actor.createActor(DisasterIDL, {
  agent,
  canisterId: DISASTER_CANISTER_ID,
});

class BlockchainService {
  // VERIFICATION FUNCTIONS
  async verifyNGO(ngoId) {
    try {
      return await VerificationActor.verifyNGO(ngoId);
    } catch (error) {
      console.error("Error verifying NGO:", error);
      return false;
    }
  }

  async rejectNGO(ngoId) {
    try {
      return await VerificationActor.rejectNGO(ngoId);
    } catch (error) {
      console.error("Error rejecting NGO:", error);
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

  async rejectBeneficiary(beneficiaryId) {
    try {
      return await VerificationActor.rejectBeneficiary(beneficiaryId);
    } catch (error) {
      console.error("Error rejecting Beneficiary:", error);
      return false;
    }
  }

  async verifyDisaster(disasterId) {
    try {
      return await VerificationActor.verifyDisaster(disasterId);
    } catch (error) {
      console.error("Error verifying Disaster:", error);
      return false;
    }
  }

  async getNGOStatus(ngoId) {
    return await VerificationActor.getNGOStatus(ngoId);
  }

  async getBeneficiaryStatus(beneficiaryId) {
    return await VerificationActor.getBeneficiaryStatus(beneficiaryId);
  }

  async getDisasterStatus(disasterId) {
    return await VerificationActor.getDisasterStatus(disasterId);
  }

  async listVerifiedNGOs() {
    return await VerificationActor.listVerifiedNGOs();
  }

  async listVerifiedBeneficiaries() {
    return await VerificationActor.listVerifiedBeneficiaries();
  }

  // ESCROW FUNCTIONS
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

  async markProposalCompleted(proposalId) {
    try {
      return await EscrowActor.markProposalCompleted(proposalId);
    } catch (error) {
      console.error("Error marking proposal completed:", error);
      return false;
    }
  }

  async withdrawRemainingFunds(proposalId) {
    try {
      return await EscrowActor.withdrawRemainingFunds(proposalId);
    } catch (error) {
      console.error("Error withdrawing remaining funds:", error);
      return false;
    }
  }

  async listAllProposals() {
    return await EscrowActor.listAllProposals();
  }

  async getProposal(proposalId) {
    return await EscrowActor.getProposal(proposalId);
  }

  // FUNDING FUNCTIONS
  async requestAid(beneficiaryId, amount) {
    try {
      return await FundingActor.requestAid(beneficiaryId, amount);
    } catch (error) {
      console.error("Error requesting aid:", error);
      return false;
    }
  }

  async approveAid(requestId) {
    try {
      return await FundingActor.approveAid(requestId);
    } catch (error) {
      console.error("Error approving aid:", error);
      return false;
    }
  }

  // DISASTER FUNCTIONS
  async reportDisaster(disasterId, location, severity) {
    try {
      return await DisasterActor.reportDisaster(disasterId, location, severity);
    } catch (error) {
      console.error("Error reporting disaster:", error);
      return false;
    }
  }

  async updateDisasterStatus(disasterId, newStatus) {
    try {
      return await DisasterActor.updateDisasterStatus(disasterId, newStatus);
    } catch (error) {
      console.error("Error updating disaster status:", error);
      return false;
    }
  }

  async getDisaster(disasterId) {
    return await DisasterActor.getDisaster(disasterId);
  }

  async getAllDisasters() {
    return await DisasterActor.getAllDisasters();
  }
}

module.exports = new BlockchainService();
