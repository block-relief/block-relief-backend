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
  };

  // Stable storage for key-value pairs
  stable var proposalEntries : [(Text, Proposal)] = [];

  // In-memory TrieMap
  var proposals = TrieMap.TrieMap<Text, Proposal>(Text.equal, Text.hash);

  // System functions for upgrade handling
  system func preupgrade() {
    proposalEntries := Iter.toArray(proposals.entries());
  };

  system func postupgrade() {
    proposals := TrieMap.fromEntries(proposalEntries.vals(), Text.equal, Text.hash);
    proposalEntries := [];
  };

  // Remove {caller} since it’s unused
  public shared func createProposal(proposalId: Text, ngoId: Text, totalAmount: Float, milestones: [Milestone]) : async Bool {
    let proposal = { proposalId = proposalId; ngoId = ngoId; totalAmount = totalAmount; milestones = milestones };
    proposals.put(proposalId, proposal);
    Debug.print("Proposal created: " # proposalId);
    return true;
  };

  // Remove {caller} since it’s unused
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

  public shared query func getProposal(proposalId: Text) : async ?Proposal {
    return proposals.get(proposalId);
  };
};