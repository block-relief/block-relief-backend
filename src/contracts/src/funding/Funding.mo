import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Float "mo:base/Float";

actor Funding {
  // Existing AidRequest type
  type RequestStatus = { #Pending; #Approved; #Rejected };
  type AidRequest = {
    requestId: Text;
    beneficiaryId: Text;
    amountRequested: Float;
    status: RequestStatus;
  };

  // New Donation type
  type DonationStatus = { #Locked; #Released; #Failed };
  type Donation = {
    donationId: Text; 
    donorId: Text;
    disasterId: ?Text;
    proposalId: ?Text;
    amount: Float;
    status: DonationStatus;
  };

  // Stable storage for upgrades
  stable var requestEntries: [(Text, AidRequest)] = [];
  stable var donationEntries: [(Text, Donation)] = [];
  var aidRequests = TrieMap.TrieMap<Text, AidRequest>(Text.equal, Text.hash);
  var donations = TrieMap.TrieMap<Text, Donation>(Text.equal, Text.hash);

  // Upgrade hooks
  system func preupgrade() {
    requestEntries := Iter.toArray(aidRequests.entries());
    donationEntries := Iter.toArray(donations.entries());
  };

  system func postupgrade() {
    aidRequests := TrieMap.fromEntries(requestEntries.vals(), Text.equal, Text.hash);
    donations := TrieMap.fromEntries(donationEntries.vals(), Text.equal, Text.hash);
    requestEntries := [];
    donationEntries := [];
  };

  // Existing aid request functions
  public shared func requestAid(requestId: Text, beneficiaryId: Text, amount: Float): async Bool {
    aidRequests.put(requestId, { requestId; beneficiaryId; amountRequested = amount; status = #Pending });
    Debug.print("Aid requested by " # beneficiaryId);
    return true;
  };

  public shared func approveAid(requestId: Text): async Bool {
    switch (aidRequests.get(requestId)) {
      case (?request) {
        aidRequests.put(requestId, { request with status = #Approved });
        return true;
      };
      case null { return false; };
    };
  };

  // New donation function
  public shared func storeDonation(donationId: Text, donorId: Text, proposalId: Text, amount: Float): async Text {
    let donation: Donation = {
      donationId;
      donorId;
      proposalId = ?proposalId; 
      disasterId = null;
      amount;
      status = #Locked; 
    };
    donations.put(donationId, donation);
    Debug.print("Donation stored: " # donationId # " for proposal " # proposalId);
    return donationId; 
  };


  // Donation function for disasters
  public shared func storeDisasterDonation(donationId: Text, donorId: Text, disasterId: Text, amount: Float): async Text {
    let donation: Donation = {
      donationId;
      donorId;
      proposalId = null; 
      disasterId = ?disasterId; 
      amount;
      status = #Locked; 
    };
    donations.put(donationId, donation);
    Debug.print("Donation stored: " # donationId # " for disaster " # disasterId);
    return donationId;
  };

  // Query donations (for transparency)
  public query func getDonation(donationId: Text): async ?Donation {
    return donations.get(donationId);
  };
};