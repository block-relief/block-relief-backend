import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array"; 

actor Verification {

  type VerificationStatus = { #Pending; #Verified; #Rejected };

  stable var ngoEntries : [(Text, VerificationStatus)] = [];
  stable var beneficiaryEntries : [(Text, VerificationStatus)] = [];
  stable var disasterEntries : [(Text, VerificationStatus)] = []; 

  var ngoRegistry = TrieMap.TrieMap<Text, VerificationStatus>(Text.equal, Text.hash);
  var beneficiaryRegistry = TrieMap.TrieMap<Text, VerificationStatus>(Text.equal, Text.hash);
  var disasterRegistry = TrieMap.TrieMap<Text, VerificationStatus>(Text.equal, Text.hash);

  system func preupgrade() {
    ngoEntries := Iter.toArray(ngoRegistry.entries());
    beneficiaryEntries := Iter.toArray(beneficiaryRegistry.entries());
    disasterEntries := Iter.toArray(disasterRegistry.entries());
  };

  system func postupgrade() {
    ngoRegistry := TrieMap.fromEntries(ngoEntries.vals(), Text.equal, Text.hash);
    beneficiaryRegistry := TrieMap.fromEntries(beneficiaryEntries.vals(), Text.equal, Text.hash);
    disasterRegistry := TrieMap.fromEntries(disasterEntries.vals(), Text.equal, Text.hash);
    ngoEntries := [];
    beneficiaryEntries := [];
    disasterEntries := [];
  };

  public shared func verifyNGO(ngoId: Text) : async Bool {
    ngoRegistry.put(ngoId, #Verified);
    Debug.print("NGO verified: " # ngoId);
    return true;
  };

  public shared func rejectNGO(ngoId: Text) : async Bool {
    ngoRegistry.put(ngoId, #Rejected);
    Debug.print("NGO rejected: " # ngoId);
    return true;
  };

  public shared func verifyBeneficiary(beneficiaryId: Text) : async Bool {
    beneficiaryRegistry.put(beneficiaryId, #Verified);
    Debug.print("Beneficiary verified: " # beneficiaryId);
    return true;
  };

  public shared func verifyDisaster(disasterId: Text) : async Bool {
    disasterRegistry.put(disasterId, #Verified);
    Debug.print("Disaster verified: " # disasterId);
    return true;
  };

  public shared func rejectBeneficiary(beneficiaryId: Text) : async Bool {
    beneficiaryRegistry.put(beneficiaryId, #Rejected);
    Debug.print("Beneficiary rejected: " # beneficiaryId);
    return true;
  };

  public shared query func getNGOStatus(ngoId: Text) : async ?VerificationStatus {
    return ngoRegistry.get(ngoId);
  };

  public shared query func getBeneficiaryStatus(beneficiaryId: Text) : async ?VerificationStatus {
    return beneficiaryRegistry.get(beneficiaryId);
  };

   public shared query func getDisasterStatus(disasterId: Text) : async ?VerificationStatus {
    return disasterRegistry.get(disasterId);
  };

  public shared query func listVerifiedNGOs() : async [Text] {
    let entries = Iter.toArray(ngoRegistry.entries());
    let verified = Array.filter<(Text, VerificationStatus)>(entries, func((id, status)) : Bool {
      status == #Verified
    });
    Array.map<(Text, VerificationStatus), Text>(verified, func((id, _)) : Text { id })
  };

  public shared query func listVerifiedBeneficiaries() : async [Text] {
    let entries = Iter.toArray(beneficiaryRegistry.entries());
    let verified = Array.filter<(Text, VerificationStatus)>(entries, func((id, status)) : Bool {
      status == #Verified
    });
    Array.map<(Text, VerificationStatus), Text>(verified, func((id, _)) : Text { id })
  };
};