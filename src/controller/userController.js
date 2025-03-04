const { verifyUser } = require("../services/userService");

async function verifyUserController(req, res) {
  const { adminHash, userHash, role } = req.body;

  try {
    // Ensure only admin can call this (assuming JWT middleware checks role)
    if (!req.user || !req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    const result = await verifyUser(adminHash, userHash, role);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { verifyUserController };