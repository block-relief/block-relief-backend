function mapRoleToBlockchain(role) {
    switch (role) {
      case "ngo":
        return "NGO";
      case "donor":
        return "Donor";
      case "beneficiary":
        return "Beneficiary";
      case "admin":
        return "Admin";
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
  
  function mapRoleToMongoDB(role) {
    switch (role) {
      case "NGO":
        return "ngo";
      case "Donor":
        return "donor";
      case "Beneficiary":
        return "beneficiary";
      case "Auditor":
        return "auditor";
      case "Admin":
        return "admin";
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }
module.exports = {
    mapRoleToBlockchain, 
    mapRoleToMongoDB
}