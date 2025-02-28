const authService = require("../services/authService");

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function registerUserController(req, res) {
    const { email, password, role, profileData, roleSpecificData } = req.body;
  
    try {
      // Call the registerUser  function
      const result = await authService.registerUser ({ email, password, role, profileData, roleSpecificData });
  
      // Respond with the created user and token
      return res.status(201).json({
        message: "User  registered successfully",
        user: result.user,
        token: result.token,
        blockchainHash: result.blockchainHash,
      });
    } catch (error) {
      // Handle errors
      console.error("Registration error:", error.message);
      return res.status(400).json({
        message: error.message,
      });
    }
  }
  

module.exports = { loginUser,  registerUserController };


