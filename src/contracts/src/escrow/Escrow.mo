import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor Escrow {

  type Milestone = {
    milestoneId: Nat;
    amount: Float;
    isReleased: Bool;
  };

  type Proposal = {
    proposalId: Text;
    ngoId: Text;
    totalAmount: Float;
    milestones: [Milestone];
    isCompleted: Bool;
  };



   // Stable storage for key-value pairs
  stable var proposalEntries : [(Text, Proposal)] = [];

  // In-memory TrieMap
  var proposals = TrieMap.TrieMap<Text, Proposal>(Text.equal, Text.hash);

  system func preupgrade() {
    proposalEntries := Iter.toArray(proposals.entries());
  };

  system func postupgrade() {
    proposals := TrieMap.fromEntries(proposalEntries.vals(), Text.equal, Text.hash);
    proposalEntries := [];
  };

  public shared func createProposal(proposalId: Text, ngoId: Text, totalAmount: Float, milestones: [Milestone]) : async Bool {
    let proposal = { proposalId = proposalId; ngoId = ngoId; totalAmount = totalAmount; milestones = milestones; isCompleted = false };
    proposals.put(proposalId, proposal);
    Debug.print("Proposal created: " # proposalId);
    return true;
  };

   public shared func releaseFunds(proposalId: Text, milestoneId: Nat) : async Bool {
    switch (proposals.get(proposalId)) {
      case (?proposal) {
        let updatedMilestones = Array.map<Milestone, Milestone>(proposal.milestones, func(m) {
          if (m.milestoneId == milestoneId) { { m with isReleased = true } } else { m }
        });
        proposals.put(proposalId, { proposal with milestones = updatedMilestones });
        Debug.print("Funds released for milestone " # Nat.toText(milestoneId));
        return true;
      };
      case null {
        Debug.print("Proposal not found");
        return false;
      };
    };
  };

  public shared func markProposalCompleted(proposalId: Text) : async Bool {
    switch (proposals.get(proposalId)) {
      case (?proposal) {
        proposals.put(proposalId, { proposal with isCompleted = true });
        Debug.print("Proposal completed: " # proposalId);
        return true;
      };
      case null {
        Debug.print("Proposal not found");
        return false;
      };
    };
  };

  public shared func withdrawRemainingFunds(proposalId: Text) : async ?Float {
    switch (proposals.get(proposalId)) {
      case (?proposal) {
        if (proposal.isCompleted) {
          let remainingFunds = Array.foldLeft<Milestone, Float>(proposal.milestones, 0, func(acc, m) {
            if (m.isReleased) { acc } else { acc + m.amount }
          });
          proposals.put(proposalId, { proposal with totalAmount = 0.0 });
          return ?remainingFunds;
        } else {
          return null;
        };
      };
      case null {
        return null;
      };
    };
  };

  public shared query func listAllProposals() : async [Text] {
    return Iter.toArray(proposals.keys());
  };

   public shared query func getProposal(proposalId: Text) : async ?Proposal {
    return proposals.get(proposalId);
  };
};
