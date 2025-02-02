const User = require('../models/User');
const Donor = require('../models/Donor');

async function registerDonor(walletAddress, email, profile, paymentMethods) {
    const user = new User({
        walletAddress,
        email,
        roles: ['donor'], // Assign role
        profile
    });

    const savedUser = await user.save();

    const donor = new Donor({
        userId: savedUser._id,
        paymentMethods
    });

    const savedDonor = await donor.save();

    // Link donor profile in User
    savedUser.linkedProfile = savedDonor._id;
    await savedUser.save();

    return savedUser;
}

module.exports = {
    registerDonor,
}
