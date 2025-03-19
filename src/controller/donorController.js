const donorService = require("../services/DonorServices")


async function getDonorDonations(req, res)  {
    try {
      const donorId = req.user.userId;
      const donationDetails = await donorService.getDonorDonationDetails(donorId);
      res.status(200).json(donationDetails);
    } catch (error) {
      console.error("Error in donor donations endpoint:", error.message);
      res.status(500).json({ error: "Failed to fetch donor donation details: " + error.message });
    }
  };

module.exports = {
    getDonorDonations,
}