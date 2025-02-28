const jwt = require("jsonwebtoken");
const { config } = require('../config/config')

JWT_SECRET = config.JWT_SECRET

function authenticate(requiredRoles = []) {
    return (req, res, next) => {
      const authHeader = req.header("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access Denied: Invalid token" });
      }
  
      const token = authHeader.split(" ")[1];
  
      try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
  
        if (requiredRoles.length > 0) {
          if (!req.user.roles || !Array.isArray(req.user.roles)) {
            return res.status(403).json({ error: "Access Forbidden: Invalid roles" });
          }
  
          const hasRequiredRole = requiredRoles.some(role => req.user.roles.includes(role));
  
          if (!hasRequiredRole) {
            return res.status(403).json({ error: "Access Forbidden: Insufficient permissions" });
          }
        }
  
        next();
      } catch (error) {
        res.status(400).json({ error: "Invalid Token" });
      }
    };  
}

module.exports = authenticate;