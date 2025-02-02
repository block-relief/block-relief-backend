import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

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

  stable var proposals = HashMap.HashMap<Text, Proposal>(0, Text.equal, Text.hash);

  public shared ({caller}) func createProposal(proposalId: Text, ngoId: Text, totalAmount: Float, milestones: [Milestone]) : async Bool {
    let proposal = { proposalId = proposalId; ngoId = ngoId; totalAmount = totalAmount; milestones = milestones };
    proposals.put(proposalId, proposal);
    Debug.print("Proposal created: " # proposalId);
    return true;
  };

  public shared ({caller}) func releaseFunds(proposalId: Text, milestoneId: Nat) : async Bool {
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
