import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

actor Verification {
  
  type VerificationStatus = { #Pending; #Verified; #Rejected };
  
  stable var ngoRegistry = HashMap.HashMap<Text, VerificationStatus>(0, Text.equal, Text.hash);
  stable var beneficiaryRegistry = HashMap.HashMap<Text, VerificationStatus>(0, Text.equal, Text.hash);
  
  public shared ({caller}) func verifyNGO(ngoId: Text) : async Bool {
    ngoRegistry.put(ngoId, #Verified);
    Debug.print("NGO verified: " # ngoId);
    return true;
  };

  public shared ({caller}) func verifyBeneficiary(beneficiaryId: Text) : async Bool {
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
