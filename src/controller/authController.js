const authService = require("../services/authService");
const { config } = require('../config/config')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

JWT_SECRET = config.JWT_SECRET


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

  async function getCurrentUser(req, res) {
    try {
      const authHeader = req.headers['authorization'];
      
      let userData = null
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        try {
          const decoded = jwt.verify(token, JWT_SECRET)
          const user = await User.findById(decoded.userId).select('email roles profile.name')

          if (user) {
            userData = {
              name: user.profile.name,
              email: user.email || null,
              role: user.roles[0]
            }
          }
        } catch (err) {
          userData = null
        }

      } 
      res.status(200).json(userData)
    } catch (error) {
      res.status(500).json({ error: 'Server error' })
    }
  }
  

module.exports = { loginUser,  registerUserController, getCurrentUser };


