import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Float "mo:base/Float";

actor Disaster {

  type DisasterStatus = { #Reported; #Assessed; #Verified; #Resolved };

  type DisasterRecord = {
    disasterId: Text;
    description: Text;
    location: Text;
    estimatedDamageCost: Float;
    reporter: Text; 
    status: DisasterStatus;
  };

  stable var disasterEntries: [(Text, DisasterRecord)] = [];

  var disasterRegistry = TrieMap.TrieMap<Text, DisasterRecord>(Text.equal, Text.hash);

  system func preupgrade() {
    disasterEntries := Iter.toArray(disasterRegistry.entries());
  };

  system func postupgrade() {
    disasterRegistry := TrieMap.fromEntries(disasterEntries.vals(), Text.equal, Text.hash);
    disasterEntries := [];
  };

  public shared func reportDisaster(disasterId: Text, description: Text, location: Text, estimatedDamageCost: Float, reporter: Text) : async Bool {
    let newDisaster = { 
      disasterId = disasterId; 
      description = description; 
      location = location;
      estimatedDamageCost = estimatedDamageCost;
      reporter = reporter;
      status = #Reported;
    };
    disasterRegistry.put(disasterId, newDisaster);
    Debug.print("Disaster reported: " # disasterId);
    return true;
  };

  // Function to update disaster status (e.g., from Reported → Assessed → Verified → Resolved)
  public shared func updateDisasterStatus(disasterId: Text, newStatus: DisasterStatus) : async Bool {
    switch (disasterRegistry.get(disasterId)) {
      case (?disaster) {
        let updatedDisaster = { disaster with status = newStatus };
        disasterRegistry.put(disasterId, updatedDisaster);
        Debug.print("Disaster status updated: " # disasterId);
        return true;
      };
      case null {
        Debug.print("Disaster not found");
        return false;
      };
    };
  };

  // Function to get disaster details
  public shared query func getDisaster(disasterId: Text) : async ?DisasterRecord {
    return disasterRegistry.get(disasterId);
  };

  // Function to get all reported disasters
  public shared query func getAllDisasters() : async [(Text, DisasterRecord)] {
    return Iter.toArray(disasterRegistry.entries());
  };
};
