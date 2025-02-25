import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor Funding {

  type RequestStatus = { #Pending; #Approved; #Rejected };
  
  type AidRequest = {
    requestId: Text;
    beneficiaryId: Text;
    amountRequested: Float;
    status: RequestStatus;
  };

  stable var requestEntries : [(Text, AidRequest)] = [];
  var aidRequests = TrieMap.TrieMap<Text, AidRequest>(Text.equal, Text.hash);

  system func preupgrade() {
    requestEntries := Iter.toArray(aidRequests.entries());
  };

  system func postupgrade() {
    aidRequests := TrieMap.fromEntries(requestEntries.vals(), Text.equal, Text.hash);
    requestEntries := [];
  };

  public shared func requestAid(requestId: Text, beneficiaryId: Text, amount: Float) : async Bool {
    aidRequests.put(requestId, { requestId = requestId; beneficiaryId = beneficiaryId; amountRequested = amount; status = #Pending });
    Debug.print("Aid requested by " # beneficiaryId);
    return true;
  };

  public shared func approveAid(requestId: Text) : async Bool {
    switch (aidRequests.get(requestId)) {
      case (?request) {
        aidRequests.put(requestId, { request with status = #Approved });
        return true;
      };
      case null {
        return false;
      };
    };
  };
};
