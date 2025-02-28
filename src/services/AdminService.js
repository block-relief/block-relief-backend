const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken_");

async function createAdmin(walletAddress, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ walletAddress, email, password: hashedPassword, roles: ["admin"] });
    const savedUser = await user.save();

    const admin = new Admin({ userId: savedUser._id });
    const savedAdmin = await admin.save();

    savedUser.linkedProfile = savedAdmin._id;
    await savedUser.save();

    const token = generateToken({ userId: savedUser._id, roles: savedUser.roles });
    return { token, user: savedUser };
}

module.exports = { createAdmin };
