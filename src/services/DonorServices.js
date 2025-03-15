const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Donor = require("../models/Donor");
const { generateToken, createSalt } = require('../utils/generateToken_');
const { mapRoleToBlockchain } = require('../utils/mapRoles');
// const blockchainService = require('./blockchain');


async function registerDonor(email, password, profile, paymentMethods) {
    if (await User.findOne({ email })) {
        throw new Error("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userHash = createSalt(email)

    // Create the user in MongoDB
    const user = new User({
        email,
        password: hashedPassword,
        roles: ["donor"],
        profile,
        blockchainHash: userHash
    });

    const savedUser = await user.save();

    // Create the donor profile in MongoDB
    const donor = new Donor({
        userId: savedUser._id,
        paymentMethods
    });

    const savedDonor = await donor.save();

    // Link the donor profile to the user
    savedUser.linkedProfile = savedDonor._id;
    await savedUser.save();

    // Register the user on the blockchain
    const blockchainRole = mapRoleToBlockchain("donor");
    // const blockchainResult = await blockchainService.addUser(userHash, blockchainRole);

    // if (!blockchainResult) {
    //     await User.deleteOne({ _id: savedUser._id });
    //     await Donor.deleteOne({ _id: savedDonor._id });
    //     throw new Error("Failed to register user on blockchain.");
    // }

    const token = generateToken({ userId: savedUser._id, roles: savedUser.roles });

    return { user: savedUser, token };
}

module.exports = { registerDonor };