const AidRequest = require('../models/AidRequest'); 
const User = require('../models/User'); 
const Beneficiary = require('../models/Beneficiary'); 
const NGO = require('../models/NGO'); 



async function requestAid(req, res) {
    try{
      const { items, description, estimatedCost, evidence, location, urgency, requestHash, requesterType } = req.body; //We extract aid request data from the request body
  
      const createdBy = req.user._id //this variable is to hold the id of the user requesting the aid, gotten from the authenticated user's data
  
      // Determine beneficiary or NGO based on requesterType
      let requestedBy;
      if (requesterType === 'Beneficiary') { //this is to see if the requester is a beneficiary. The other side is it could be an NGO.
        const beneficiary = await Beneficiary.findOne({ user: createdBy }); //This variable is used to establish beneficiary status by entering the beneficiary collection and finding out if the user is indeed a beneficiary
        if (!beneficiary) { //this is when the user is not a beneficiary
            return res.status(400).json({ error: "Beneficiary not found for the logged in user." }); //we return an error to suggest that the user is not a beneficiary
        }
        requestedBy = beneficiary._id; //Once we establish that the user is indeed a beneficiary, we assign the his/her beneficiary id to the requestedBy variable
      } else if (requesterType === 'NGO') { //Now this is the other side. Meaning the requesterType is an NGO 
        const ngo = await NGO.findOne({ user: createdBy }); //We establish the NGO status by verifying the user is truly an NGO through entering the NGO collection and finding if the user indeed has a profile in the NGO collection and then assign it to the ngo variable
        if (!ngo) { 
            return res.status(400).json({ error: "NGO not found for the logged in user." }); //we return a response containing an error to suggest the user has not been found to be an NGO
        }
        requestedBy = ngo._id; //we assign the user's ngo id to the requestedBy variable once we establish that the user is indeed an NGO
  
        // Find the user that created the aid request. Although we have done some verification already using createdBy which relies on middleware authentication, we verify if the user exists in the database for best practices and extra security reasons
        const user = await User.findById(createdBy);
        if(!user){
          return res.status(400).json({error: "User not found"});
        }
  
      } else {
          return res.status(400).json({ error: "Invalid requesterType." });
      }
  
         // Create the AidRequest document(an instance of the AidRequest to be saved in the collection)
         const aidRequest = new AidRequest({
          items,
          description,
          estimatedCost,
          evidence,
          location,
          urgency,
          requestHash,
          requestedBy,
          requesterType,
          createdBy,
          });
  
      const savedAidRequest = await aidRequest.save(); //We save the aidRequest in the collection
  
      res.status(201).json(savedAidRequest); //return a response with status 201 which indicates successful creation and a json format of the savedAidRequest
    
    }catch (error){
      console.error("Error creating aid request:", error);
      res.status(400).json({ error: "Invalid request" });
    }
  }


  async function getAllAidRequests(req, res) {
    try {
        if (req.user.role !== 'admin') { //over here we assume we're using an authentication middleware that verifies the role of the current user
            return res.status(403).json({ error: "Unauthorized: Admin access required." });
        }
        const aidRequests = await AidRequest.find(); //over here we query the database for all instances of aidRequest
        res.status(200).json(aidRequests);
      } catch (error) {
        console.error("Error fetching all aid requests:", error);
        res.status(500).json({ error: "Internal server error." });
      }
    }
    
    module.exports = { requestAid, getAllAidRequests }





















    //for later
    // // const aidRequests = await AidRequest.find().populate('beneficiary').populate('ngo').populate('createdBy'); // Populate related data
    // const aidRequests = await AidRequest.find()
    // .populate({
    //     path: 'beneficiary',
    //     select: 'name contactDetails address', // Select specific beneficiary fields to include
    //     // Optionally, add match criteria or other populate options here
    // })
    // .populate({
    //     path: 'ngo',
    //     select: 'name description contactEmail', // Select specific NGO fields to include
    //     // Optionally, add match criteria or other populate options here
    // })
    // .populate({
    //     path: 'createdBy',
    //     select: 'username email role', // Select specific User fields to include
    //     // Optionally, add match criteria or other populate options here
    // });

// Detailed Comment:
// ----------------------------------------------------------------------------------------------------
// This line retrieves all AidRequest documents from the MongoDB database using the AidRequest Mongoose model.
// It then uses the 'populate' method to replace the 'beneficiary', 'ngo', and 'createdBy' fields, which are ObjectIds,
// with the actual documents from their respective collections (Beneficiary, NGO, and User).
//
// populate('beneficiary'):
//   - Replaces the 'beneficiary' ObjectId in each AidRequest document with the full Beneficiary document.
//   - The 'select' option is used to specify which fields from the Beneficiary document should be included in the populated data.
//     This helps to reduce the amount of data transferred and improves performance.
//   - Additional options like 'match' can be added to filter the related documents based on specific criteria.
//
// populate('ngo'):
//   - Replaces the 'ngo' ObjectId in each AidRequest document with the full NGO document.
//   - The 'select' option is used to specify which fields from the NGO document should be included.
//   - Additional options like 'match' can be added to filter the related documents based on specific criteria.
//
// populate('createdBy'):
//   - Replaces the 'createdBy' ObjectId in each AidRequest document with the full User document.
//   - The 'select' option is used to specify which fields from the User document should be included.
//   - Additional options like 'match' can be added to filter the related documents based on specific criteria.
//
// By populating these fields, the API response will contain more complete and meaningful data,
// making it easier for the client to understand and use the AidRequest information without needing to make additional requests
// to fetch the related documents.
// ----------------------------------------------------------------------------------------------------