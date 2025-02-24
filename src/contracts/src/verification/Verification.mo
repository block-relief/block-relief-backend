import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor Verification {

  type VerificationStatus = { #Pending; #Verified; #Rejected };

  // Stable storage for key-value pairs
  stable var ngoEntries : [(Text, VerificationStatus)] = [];
  stable var beneficiaryEntries : [(Text, VerificationStatus)] = [];

  // In-memory TrieMaps
  var ngoRegistry = TrieMap.TrieMap<Text, VerificationStatus>(Text.equal, Text.hash);
  var beneficiaryRegistry = TrieMap.TrieMap<Text, VerificationStatus>(Text.equal, Text.hash);

  // System functions for upgrade handling
  system func preupgrade() {
    ngoEntries := Iter.toArray(ngoRegistry.entries());
    beneficiaryEntries := Iter.toArray(beneficiaryRegistry.entries());
  };

  system func postupgrade() {
    ngoRegistry := TrieMap.fromEntries(ngoEntries.vals(), Text.equal, Text.hash);
    beneficiaryRegistry := TrieMap.fromEntries(beneficiaryEntries.vals(), Text.equal, Text.hash);
    ngoEntries := [];
    beneficiaryEntries := [];
  };

  // Remove {caller} since it’s unused
  public shared func verifyNGO(ngoId: Text) : async Bool {
    ngoRegistry.put(ngoId, #Verified);
    Debug.print("NGO verified: " # ngoId);
    return true;
  };

  // Remove {caller} since it’s unused
  public shared func verifyBeneficiary(beneficiaryId: Text) : async Bool {
    beneficiaryRegistry.put(beneficiaryId, #Verified);
    Debug.print("Beneficiary verified: " # beneficiaryId);
    return true;
  };

  public shared query func getNGOStatus(ngoId: Text) : async ?VerificationStatus {
    return ngoRegistry.get(ngoId);
  };

  public shared query func getBeneficiaryStatus(beneficiaryId: Text) : async ?VerificationStatus {
    return beneficiaryRegistry.get(beneficiaryId);
  };
};