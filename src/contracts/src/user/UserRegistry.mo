import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

actor UserRegistry {
  type UserHash = Text;
  type UserRole = { #NGO; #Donor; #Beneficiary; #Admin; #Pending };

  // Stable storage for user entries
  stable var userEntries : [(UserHash, UserRole)] = [];
  // In-memory TrieMap for efficient lookups
  var users = TrieMap.TrieMap<UserHash, UserRole>(Text.equal, Text.hash);

  // Upgrade handling
  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := TrieMap.fromEntries(userEntries.vals(), Text.equal, Text.hash);
    userEntries := [];
  };

  // Bootstrap the first admin (remove after initial deploy)
  public shared func bootstrapInitialAdmin(userHash : UserHash) : async Bool {
    users.put(userHash, #Admin);
    Debug.print("Initial admin bootstrapped: " # userHash);
    true
  };

  // Add a new user, donors are added directly, others start as Pending
  public shared func addUser(userHash : UserHash, role : UserRole) : async Bool {
    switch (role) {
      case (#Donor) {
        users.put(userHash, #Donor);
        Debug.print("Donor added directly: " # userHash);
      };
      case (_) {
        users.put(userHash, #Pending);
        Debug.print("User added as pending: " # userHash # " with requested role " # debug_show(role));
      };
    };
    true
  };

  // Verify a user and assign their final role (restricted to Admins)
  public shared ({caller}) func verifyUser(userHash : UserHash, role : UserRole) : async Bool {
    switch (users.get(Principal.toText(caller))) {
      case (?#Admin) {
        switch (users.get(userHash)) {
          case (?#Pending) {
            users.put(userHash, role);
            Debug.print("User verified: " # userHash # " as " # debug_show(role) # " by " # Principal.toText(caller));
            true
          };
          case _ {
            Debug.print("User " # userHash # " not pending or already verified");
            false
          };
        }
      };
      case _ {
        Debug.print("Unauthorized caller: " # Principal.toText(caller));
        false
      };
    }
  };

  // Get the role of a user
  public shared query func getUserRole(userHash : UserHash) : async ?UserRole {
    users.get(userHash)
  };

  // List all users
  public shared query func listUsers() : async [(UserHash, UserRole)] {
    Iter.toArray(users.entries())
  };

  // List verified NGOs
  public shared query func listVerifiedNGOs() : async [UserHash] {
    let entries = Iter.toArray(users.entries());
    Array.mapFilter<(UserHash, UserRole), UserHash>(
      entries,
      func((hash, role)) : ?UserHash {
        if (role == #NGO) { ?hash } else { null }
      }
    )
  };

  // List verified beneficiaries
  public shared query func listVerifiedBeneficiaries() : async [UserHash] {
    let entries = Iter.toArray(users.entries());
    Array.mapFilter<(UserHash, UserRole), UserHash>(
      entries,
      func((hash, role)) : ?UserHash {
        if (role == #Beneficiary) { ?hash } else { null }
      }
    )
  };
}