const authService = require("../services/DonorServices");

async function donorSignUp(req, res) {
    try {
        const { email, password, profile, paymentMethods } = req.body;
        const result = await authService.registerDonor(email, password, profile, paymentMethods);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    donorSignUp
}