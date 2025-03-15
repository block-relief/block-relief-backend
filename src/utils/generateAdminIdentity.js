// const { HttpAgent, Actor } = require("@dfinity/agent");
// const { Ed25519KeyIdentity } = require("@dfinity/identity")
// const { idlFactory: UserRegistryIDL } = require("../declarations/user/user.did.js");
// const fs = require('fs');
// const dotenv = require("dotenv");

// dotenv.config();

// const USER_CANISTER_ID = 'b77ix-eeaaa-aaaaa-qaada-cai'

// // Generate and save admin identity
// async function generateAndSaveAdminIdentity() {
//   let adminIdentity;
//   const adminJsonPath = 'admin.json';

//   // Check if admin.json exists
//   if (fs.existsSync(adminJsonPath)) {
//     adminIdentity = Ed25519KeyIdentity.fromJSON(fs.readFileSync(adminJsonPath));
//     console.log("Using existing admin identity:", adminIdentity.getPrincipal().toText());
//   } else {
//     adminIdentity = Ed25519KeyIdentity.generate();
//     console.log("Generated new admin identity:", adminIdentity.getPrincipal().toText());
//   }
  
//   const agent = new HttpAgent({
//     host: "http://127.0.0.1:4943",
//     identity: adminIdentity 
//   });

//   agent.fetchRootKey().catch(err => console.error("Error fetching root key:", err));
//   const UserActor = Actor.createActor(UserRegistryIDL, { agent, canisterId: USER_CANISTER_ID });

//   const userHash = "d97cac5ea4a7743433ace6a73990db8bf5f1f2adc864b0ef24b093419e125b61";
//   const bootstrapResult = await UserActor.bootstrapInitialAdmin(userHash);

//   if (bootstrapResult) {
//     console.log("Admin Principal:", adminIdentity.getPrincipal().toText());
//     console.log("Bootstrap successful:", bootstrapResult);

//     // Save to admin.json
//     const identityJson = JSON.stringify(adminIdentity.toJSON(), null, 2);
//     fs.writeFileSync('admin.json', identityJson);
//     console.log("Admin identity saved to admin.json");
//   } else {
//     console.error("Bootstrap failed");
//   }
// }

// generateAndSaveAdminIdentity().catch(console.error);