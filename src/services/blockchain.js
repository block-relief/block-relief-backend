const { HttpAgent, Actor } = require("@dfinity/agent");
const {Ed25519KeyIdentity } = require("@dfinity/identity");

// const { idlFactory: VerificationIDL } = require("../contracts/src/declarations/verification/verification.did.js");
const { idlFactory: EscrowIDL } = require("../contracts/src/declarations/escrow/escrow.did.js");
const { idlFactory: FundingIDL } = require("../contracts/src/declarations/funding/funding.did.js");
const { idlFactory: DisasterIDL } = require("../contracts/src/declarations/disaster/disaster.did.js");
const { idlFactory: UserRegistryIDL } = require("../contracts/src/declarations/user/user.did.js");
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

dotenv.config();

const ESCROW_CANISTER_ID = process.env.CANISTER_ID_ESCROW;
const FUNDING_CANISTER_ID = process.env.CANISTER_ID_FUNDING;
const DISASTER_CANISTER_ID = process.env.CANISTER_ID_DISASTER
const USER_CANISTER_ID = process.env.USER_CANISTER_ID;

// Load admin identity from utils folder
const adminJsonPath = path.join(__dirname, '..', 'utils', 'admin.json');
const adminIdentity = Ed25519KeyIdentity.fromJSON(fs.readFileSync(adminJsonPath));
console.log("Loaded admin principal:", adminIdentity.getPrincipal().toText());

const agent = new HttpAgent({ host: "http://127.0.0.1:4943", identity: adminIdentity });
agent.fetchRootKey().catch(err => console.error("Error fetching root key:", err));

// Create actor instances
const EscrowActor = Actor.createActor(EscrowIDL, { agent, canisterId: ESCROW_CANISTER_ID });
const FundingActor = Actor.createActor(FundingIDL, { agent, canisterId: FUNDING_CANISTER_ID });
const DisasterActor = Actor.createActor(DisasterIDL, { agent, canisterId: DISASTER_CANISTER_ID });
const UserActor = Actor.createActor(UserRegistryIDL, { agent, canisterId: USER_CANISTER_ID });

class BlockchainService {
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

  // USER REGISTRY FUNCTIONS
  async addUser(userHash, role) {
    try {
      const roleVariant = { [role]: null };
      return await UserActor.addUser(userHash, roleVariant);
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  }

  async verifyUser(userHash, role) {
    try {
      const roleVariant = { [role]: null };
      const result = await UserActor.verifyUser(userHash, roleVariant);
      return result;
    } catch (error) {
      console.error("Error verifying user:", error);
      return false;
    }
  }

  async getUserRole(userHash) {
    try {
      const result = await UserActor.getUserRole(userHash);
      if (result && result.length > 0) {
        return Object.keys(result[0])[0];
      }
      return null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  async listUsers() {
    try {
      const users = await UserActor.listUsers();
      return users.map(([userHash, role]) => ({
        userHash,
        role: Object.keys(role)[0]
      }));
    } catch (error) {
      console.error("Error listing users:", error);
      return [];
    }
  }

  async bootstrapInitialAdmin(userHash) {
    try {
      return await UserActor.bootstrapInitialAdmin(userHash);
    } catch (error) {
      console.error("Error bootstrapping initial admin:", error);
      return false;
    }
  }

  async listVerifiedNGOs() {
    try {
      const ngos = await UserActor.listVerifiedNGOs();
      return ngos;
    } catch (error) {
      console.error("Error listing verified NGOs:", error);
      return [];
    }
  }

  async listVerifiedBeneficiaries() {
    try {
      const beneficiaries = await UserActor.listVerifiedBeneficiaries();
      return beneficiaries;
    } catch (error) {
      console.error("Error listing verified beneficiaries:", error);
      return [];
    }
  }
}

module.exports = new BlockchainService();